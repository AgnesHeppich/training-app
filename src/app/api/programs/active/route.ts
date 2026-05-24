import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';
import type { WorkoutDay } from '@/data/program';

export async function GET() {
    try {
        await initDb();
        const rows = await sql`
            SELECT
                wd.slug        AS id,
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
            WHERE p.is_active = TRUE
            GROUP BY wd.id, wd.slug, wd.week, wd.day_label, wd.title, wd.focus, wd.sort_order
            ORDER BY wd.sort_order
        `;

        const program: WorkoutDay[] = rows.map(row => ({
            id: row.id,
            week: row.week,
            dayLabel: row.dayLabel,
            title: row.title,
            focus: row.focus,
            exercises: row.exercises,
        }));

        return NextResponse.json(program);
    } catch (e) {
        console.error('GET /api/programs/active error', e);
        return NextResponse.json([], { status: 500 });
    }
}
