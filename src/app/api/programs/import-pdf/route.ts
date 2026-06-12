import { openai } from '@ai-sdk/openai';
import { generateText, Output } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { PDFParse } from 'pdf-parse';
import { sql, initDb } from '@/lib/db';
import { auth } from '@/lib/auth/server';
import { GeneratedProgramSchema, type GeneratedProgram } from '@/lib/programGenerationSchema';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        const { data: session } = await auth.getSession();
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const userId = session.user.id;

        const formData = await req.formData();
        const file = formData.get('pdf');
        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const parser = new PDFParse({ data: buffer });
        const parsed = await parser.getText();
        const extractedText = parsed.text?.trim() ?? '';

        if (extractedText.length < 100) {
            return NextResponse.json(
                { error: 'Could not extract text from this PDF — it may be a scanned image. Please try a text-based PDF.' },
                { status: 400 }
            );
        }

        const truncatedText = extractedText.slice(0, 20000);

        await initDb();

        const systemPrompt = `You are an expert fitness coach. The following text was extracted from a PDF training program.
Parse it into a structured workout program regardless of the original formatting.

Rules:
- Preserve the original exercise names exactly as written
- dayLabel must be a day of the week (Monday, Tuesday, etc.) — if the PDF uses day numbers or session numbers, distribute evenly across the week starting from Monday
- If sets/reps are missing for an exercise, use reasonable defaults (3 sets / "8-12" reps for strength, or appropriate cardio defaults)
- For cardio/running exercises: reps = distance or time (e.g. "400m", "20 min"); name must clearly indicate it is cardio (e.g. "Easy 5k Run", "20 min Tempo Run")
- For strength exercises: reps = rep range (e.g. "8-12", "5", "max")
- Mark warmup/mobility exercises with isWarmup: true; all working sets isWarmup: false
- note: null unless there is a specific coaching instruction in the PDF for that exercise
- Name the program based on what you read in the PDF (e.g. "8-Week Powerlifting Block")
- Write a 1-2 sentence description summarising the program

PDF content:
${truncatedText}`;

        const result = await generateText({
            model: openai('gpt-5.4'),
            output: Output.object({ schema: GeneratedProgramSchema }),
            prompt: systemPrompt,
            maxRetries: 2,
        });

        const generated = result.output as GeneratedProgram;

        // Insert program
        const [program] = await sql`
            INSERT INTO programs (name, description, is_active, created_by)
            VALUES (${generated.name}, ${generated.description}, FALSE, ${userId})
            RETURNING id
        `;
        const programId = program.id;

        // Batch-insert all workout days
        const dayQueries = generated.workouts.map((workout: GeneratedProgram['workouts'][number], i: number) => {
            const slug = `w${workout.week}-d${i + 1}`;
            return sql`
                INSERT INTO workout_days (program_id, slug, week, day_label, title, focus, sort_order)
                VALUES (${programId}, ${slug}, ${workout.week}, ${workout.dayLabel}, ${workout.title}, ${workout.focus}, ${i})
                RETURNING id
            `;
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dayResults: any[] = await sql.transaction(dayQueries);

        // Batch-insert all exercises
        const exerciseQueries = generated.workouts.flatMap((workout: GeneratedProgram['workouts'][number], i: number) => {
            const dayId = dayResults[i][0].id;
            return workout.exercises.map((ex: GeneratedProgram['workouts'][number]['exercises'][number], j: number) =>
                sql`
                    INSERT INTO exercises (workout_day_id, name, sets, reps, note, is_warmup, sort_order)
                    VALUES (${dayId}, ${ex.name}, ${ex.sets}, ${ex.reps}, ${ex.note ?? null}, ${ex.isWarmup ?? false}, ${j})
                `
            );
        });
        await sql.transaction(exerciseQueries);

        // Archive current active enrollment and activate the new program
        await sql`
            UPDATE user_program_enrollments
            SET status = 'completed', completed_at = NOW()
            WHERE user_id = ${userId} AND status = 'active'
        `;
        await sql`
            INSERT INTO user_program_enrollments (user_id, program_id, status, started_at, completed_at)
            VALUES (${userId}, ${programId}, 'active', NOW(), NULL)
            ON CONFLICT (user_id, program_id) DO UPDATE SET
                status = 'active',
                started_at = NOW(),
                completed_at = NULL
        `;

        return NextResponse.json({ programId, name: generated.name });
    } catch (e) {
        console.error('POST /api/programs/import-pdf error', e);
        return NextResponse.json({ error: 'Failed to import program from PDF' }, { status: 500 });
    }
}
