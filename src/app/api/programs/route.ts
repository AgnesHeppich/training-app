import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';
import { auth } from '@/lib/auth/server';

export async function GET() {
    try {
        await initDb();

        const { data: session } = await auth.getSession();
        const userId = session?.user?.id ?? null;

        const rows = await sql`
            SELECT
                p.id,
                p.name,
                p.description,
                p.is_active,
                p.created_at,
                (p.created_by IS NOT NULL) AS is_generated,
                COUNT(DISTINCT wd.id)::int AS workout_count
            FROM programs p
            LEFT JOIN workout_days wd ON wd.program_id = p.id
            WHERE p.created_by IS NULL OR p.created_by = ${userId}
            GROUP BY p.id
            ORDER BY p.created_by IS NOT NULL ASC, p.created_at ASC
        `;

        if (!userId) return NextResponse.json(rows);

        // Attach enrollment status for the requesting user
        const enrollments = await sql`
            SELECT program_id, status, started_at, completed_at
            FROM user_program_enrollments
            WHERE user_id = ${userId}
        `;

        const enrollmentMap = new Map(enrollments.map(e => [e.program_id, e]));

        const result = rows.map(p => ({
            ...p,
            enrollment: enrollmentMap.get(p.id) ?? null,
        }));

        return NextResponse.json(result);
    } catch (e) {
        console.error('GET /api/programs error', e);
        return NextResponse.json([], { status: 500 });
    }
}
