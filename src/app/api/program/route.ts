import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';
import { auth } from '@/lib/auth/server';

export async function GET() {
    try {
        const { data: session } = await auth.getSession();
        if (!session?.user?.id) return NextResponse.json({ overrides: {} }, { status: 401 });
        const userId = session.user.id;

        await initDb();
        const rows = await sql`SELECT overrides FROM program_overrides WHERE user_id = ${userId}`;
        if (rows.length === 0) return NextResponse.json({ overrides: {} });
        return NextResponse.json({ overrides: rows[0].overrides ?? {} });
    } catch (e) {
        console.error('GET /api/program error', e);
        return NextResponse.json({ overrides: {} }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { data: session } = await auth.getSession();
        if (!session?.user?.id) return NextResponse.json({ ok: false }, { status: 401 });
        const userId = session.user.id;

        await initDb();
        const body = await request.json();
        const overrides = body.overrides ?? {};
        await sql`
            INSERT INTO program_overrides (user_id, overrides, updated_at)
            VALUES (${userId}, ${JSON.stringify(overrides)}, NOW())
            ON CONFLICT (user_id) DO UPDATE SET
                overrides = EXCLUDED.overrides,
                updated_at = NOW()
        `;
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error('PUT /api/program error', e);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
