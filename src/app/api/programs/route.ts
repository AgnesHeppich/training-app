import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export async function GET() {
    try {
        await initDb();
        const rows = await sql`
            SELECT id, name, description, is_active, created_at
            FROM programs
            ORDER BY created_at ASC
        `;
        return NextResponse.json(rows);
    } catch (e) {
        console.error('GET /api/programs error', e);
        return NextResponse.json([], { status: 500 });
    }
}
