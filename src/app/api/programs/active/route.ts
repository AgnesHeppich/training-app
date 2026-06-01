import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';
import { auth } from '@/lib/auth/server';
import type { WorkoutDay } from '@/data/program';

export async function GET() {
    try {
        await initDb();

        const { data: session } = await auth.getSession();
        const userId = session?.user?.id ?? null;

        let programId: number | null = null;

        if (userId) {
            const enrollment = await sql`
                SELECT program_id FROM user_program_enrollments
                WHERE user_id = ${userId} AND status = 'active'
                LIMIT 1
            `;
            if (enrollment.length > 0) programId = enrollment[0].program_id;
        }

        if (!programId) {
            return NextResponse.json({ id: null, name: null, workouts: [] });
        }

        const rows = await sql`
            SELECT
                p.id        AS "programId",
                p.name      AS "programName",
                wd.slug     AS id,
                wd.week,
                wd.day_label   AS "dayLabel",
                wd.title,
                wd.focus,
                json_agg(
                    json_build_object(
                        'name',     e.name,
                        'sets',     e.sets,
                        'reps',     e.reps,
                        'note',     e.note,
                        'isWarmup', e.is_warmup
                    ) ORDER BY e.sort_order
                ) AS exercises
            FROM programs p
            JOIN workout_days wd ON wd.program_id = p.id
            JOIN exercises    e  ON e.workout_day_id = wd.id
            WHERE p.id = ${programId}
            GROUP BY p.id, p.name, wd.id, wd.slug, wd.week, wd.day_label, wd.title, wd.focus, wd.sort_order
            ORDER BY wd.sort_order
        `;

        if (rows.length === 0) {
            return NextResponse.json({ id: null, name: null, workouts: [] });
        }

        const workouts: WorkoutDay[] = rows.map(row => ({
            id: row.id,
            week: row.week,
            dayLabel: row.dayLabel,
            title: row.title,
            focus: row.focus,
            exercises: row.exercises,
        }));

        return NextResponse.json({ id: rows[0].programId, name: rows[0].programName, workouts });
    } catch (e) {
        console.error('GET /api/programs/active error', e);
        return NextResponse.json({ id: null, name: null, workouts: [] }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { data: session } = await auth.getSession();
        if (!session?.user?.id) return NextResponse.json({ ok: false }, { status: 401 });
        const userId = session.user.id;

        const { programId } = await request.json();
        if (!programId) return NextResponse.json({ ok: false }, { status: 400 });

        await initDb();

        // Archive current active enrollment
        await sql`
            UPDATE user_program_enrollments
            SET status = 'completed', completed_at = NOW()
            WHERE user_id = ${userId} AND status = 'active'
        `;

        // Activate the new program (or re-activate a previously completed one)
        await sql`
            INSERT INTO user_program_enrollments (user_id, program_id, status, started_at, completed_at)
            VALUES (${userId}, ${programId}, 'active', NOW(), NULL)
            ON CONFLICT (user_id, program_id) DO UPDATE SET
                status = 'active',
                started_at = NOW(),
                completed_at = NULL
        `;

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error('PUT /api/programs/active error', e);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
