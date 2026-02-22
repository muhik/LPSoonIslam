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
            sql: 'SELECT status, email, mayar_id FROM transactions WHERE id = ?',
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

        // --- THE "CRON JOB" POLLING FALLBACK ---
        // If our local database still says PENDING, let's double check with Mayar directly
        if (tx.status === 'PENDING' && tx.mayar_id) {
            try {
                const mayarResponse = await fetch(`https://api.mayar.id/hl/v1/invoice/${tx.mayar_id}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.MAYAR_API_KEY}`
                    }
                });

                if (mayarResponse.ok) {
                    const mayarData = await mayarResponse.json();
                    const currentMayarStatus = mayarData?.data?.status;

                    if (currentMayarStatus === 'PAID' || currentMayarStatus === 'SETTLED' || currentMayarStatus === 'paid' || currentMayarStatus === 'SUCCESS') {
                        // Webhook missed it! Let's update our database manually
                        await db.execute({
                            sql: `UPDATE transactions SET status = 'PAID' WHERE id = ?`,
                            args: [id]
                        });
                        console.log(`Polling fallback detected PAID status for transaction ${id}, manually updated.`);
                        return NextResponse.json({ status: 'PAID' });
                    }
                }
            } catch (pollErr) {
                console.error('Failed to poll Mayar for status:', pollErr);
                // Ignore error and fall through to return our local 'PENDING' status
            }
        }

        return NextResponse.json({ status: tx.status });

    } catch (error) {
        console.error('Error fetching transaction status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
