export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: rawId } = await context.params;
        const id = parseInt(rawId, 10);

        // Extract email from query params for security validation
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (isNaN(id) || !email) {
            return NextResponse.json({ error: 'Missing id or email' }, { status: 400 });
        }

        const db = await getDb();
        const result = await db.execute({
            sql: 'SELECT status, email FROM transactions WHERE id = ?',
            args: [id]
        });

        const tx = result.rows[0] as any;

        if (!tx) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        // Validate that the email matches the transaction (Security layer)
        if (tx.email.toLowerCase() !== email.toLowerCase()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json({ status: tx.status });

    } catch (error) {
        console.error('Error fetching transaction status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
