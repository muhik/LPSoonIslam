export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const db = await getDb();
        const result = await db.execute('SELECT * FROM webhook_logs ORDER BY id DESC LIMIT 50');

        // Return raw JSON arrays for debugging
        return NextResponse.json(result.rows);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
