import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';
import { auth } from '@/lib/auth/server';

const EMPTY = { completedWorkouts: [], logs: {}, notes: {}, logTypes: {} };

export async function GET(request: Request) {
    try {
        const { data: session } = await auth.getSession();
        if (!session?.user?.id) return NextResponse.json(EMPTY, { status: 401 });
        const userId = session.user.id;

        await initDb();

        // Resolve programId from query param or active enrollment
        const { searchParams } = new URL(request.url);
        const programIdParam = searchParams.get('programId');
        let programId: number | null = programIdParam ? parseInt(programIdParam) : null;

        if (!programId) {
            const enrollment = await sql`
                SELECT program_id FROM user_program_enrollments
                WHERE user_id = ${userId} AND status = 'active'
                LIMIT 1
            `;
            if (enrollment.length > 0) programId = enrollment[0].program_id;
        }

        if (!programId) return NextResponse.json(EMPTY);

        const rows = await sql`
            SELECT completed_workouts, logs, notes, log_types
            FROM workout_history
            WHERE user_id = ${userId} AND program_id = ${programId}
        `;

        if (rows.length === 0) return NextResponse.json(EMPTY);
        const row = rows[0];
        return NextResponse.json({
            completedWorkouts: row.completed_workouts ?? [],
            logs: row.logs ?? {},
            notes: row.notes ?? {},
            logTypes: row.log_types ?? {},
        });
    } catch (e) {
        console.error('GET /api/history error', e);
        return NextResponse.json(EMPTY, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { data: session } = await auth.getSession();
        if (!session?.user?.id) return NextResponse.json({ ok: false }, { status: 401 });
        const userId = session.user.id;

        await initDb();
        const body = await request.json();
        const programId: number | undefined = body.programId;
        if (!programId) return NextResponse.json({ ok: false }, { status: 400 });

        const completedWorkouts = body.completedWorkouts ?? [];
        const logs = body.logs ?? {};
        const notes = body.notes ?? {};
        const logTypes = body.logTypes ?? {};

        await sql`
            INSERT INTO workout_history (user_id, program_id, completed_workouts, logs, notes, log_types, updated_at)
            VALUES (${userId}, ${programId}, ${JSON.stringify(completedWorkouts)}, ${JSON.stringify(logs)}, ${JSON.stringify(notes)}, ${JSON.stringify(logTypes)}, NOW())
            ON CONFLICT (user_id, program_id) DO UPDATE SET
                completed_workouts = EXCLUDED.completed_workouts,
                logs = EXCLUDED.logs,
                notes = EXCLUDED.notes,
                log_types = EXCLUDED.log_types,
                updated_at = NOW()
        `;
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error('PUT /api/history error', e);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
