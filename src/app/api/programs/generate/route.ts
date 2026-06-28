import { openai } from '@ai-sdk/openai';
import { generateText, Output } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';
import { auth } from '@/lib/auth/server';
import { GeneratedProgramSchema, type GeneratedProgram } from '@/lib/programGenerationSchema';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        const { data: session } = await auth.getSession();
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const userId = session.user.id;

        const { prompt, goalType, weeks, sessionsPerWeek, variation, weakness } = await req.json();
        if (!prompt || !weeks || !sessionsPerWeek) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await initDb();

        const systemPrompt = `You are an expert personal trainer designing a structured workout program.

Program type: ${goalType ?? 'General fitness'}
User goal: ${prompt}
Duration: ${weeks} weeks
Sessions per week: ${sessionsPerWeek} (${weeks * sessionsPerWeek} total sessions)
${variation ? `Training mix/variation: ${variation}` : ''}
${weakness ? `Injuries or limitations to consider: ${weakness}` : ''}

Design the full ${weeks}-week program and follow these rules:

NAMING AND STRUCTURE:
- Name the program short and descriptively (e.g. "8-Week Pull-Up Builder")
- The description must be at most two sentences — no more. Keep it brief and focused on the program goal.
- dayLabel must be a day of the week (e.g. "Monday", "Wednesday", "Friday")
- Distribute sessions evenly across the week
- Include 4-8 exercises per session (including warmup)

EXERCISE LOGGING FORMAT — this is critical:
- For CARDIO / RUNNING exercises: name must clearly indicate the type. Use names like "400m Run Intervals", "Easy 5k Run", "Tempo Run", "Sprint Intervals", "20 min Easy Jog", "Rowing Intervals". Set reps to distance or time (e.g. "400m", "20 min", "5km"). These will show a time input when logged.
- For STRENGTH / GYM exercises: use standard exercise names (e.g. "Pull-Ups", "Barbell Squat", "Dumbbell Row"). Set reps to rep ranges (e.g. "8-12", "5", "max").
- Mark warmup exercises (light mobility, dynamic stretching) with isWarmup: true
- Always set isWarmup: false for main working sets
- Always provide note as null if there is no specific coaching note

${weakness ? `INJURY ADAPTATION: The user has the following limitation: "${weakness}". Avoid or modify exercises that would aggravate this. Add coaching notes on exercises near the affected area.` : ''}`;

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

        // Batch-insert all workout days in one transaction
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

        // Batch-insert all exercises in one transaction
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
        console.error('POST /api/programs/generate error', e);
        return NextResponse.json({ error: 'Failed to generate program' }, { status: 500 });
    }
}
