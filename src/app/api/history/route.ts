import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';
import { auth } from '@/lib/auth/server';

const EMPTY: { completedWorkouts: string[]; logs: Record<string, unknown>; notes: Record<string, unknown> } = {
    completedWorkouts: [],
    logs: {},
    notes: {},
};

export async function GET() {
    try {
        const { data: session } = await auth.getSession();
        if (!session?.user?.id) return NextResponse.json(EMPTY, { status: 401 });
        const userId = session.user.id;

        await initDb();
        const rows = await sql`SELECT completed_workouts, logs, notes FROM workout_history WHERE user_id = ${userId}`;
        if (rows.length === 0) return NextResponse.json(EMPTY);
        const row = rows[0];
        return NextResponse.json({
            completedWorkouts: row.completed_workouts ?? [],
            logs: row.logs ?? {},
            notes: row.notes ?? {},
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
        const completedWorkouts = body.completedWorkouts ?? [];
        const logs = body.logs ?? {};
        const notes = body.notes ?? {};
        await sql`
            INSERT INTO workout_history (user_id, completed_workouts, logs, notes, updated_at)
            VALUES (${userId}, ${JSON.stringify(completedWorkouts)}, ${JSON.stringify(logs)}, ${JSON.stringify(notes)}, NOW())
            ON CONFLICT (user_id) DO UPDATE SET
                completed_workouts = EXCLUDED.completed_workouts,
                logs = EXCLUDED.logs,
                notes = EXCLUDED.notes,
                updated_at = NOW()
        `;
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error('PUT /api/history error', e);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
