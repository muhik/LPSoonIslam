export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
    try {
        // Mayar sends webhook payloads as JSON
        const body = await request.json();
        const event = body.event;
        const data = body.data;

        console.log('Received Mayar Webhook:', JSON.stringify({ event, invoice_id: data?.id }, null, 2));

        // We only care about successful payments
        if (event === 'payment.success') {
            // In Mayar, the redirect_url we sent earlier contains the local transaction ID.
            // However, the cleanest way without custom metadata in the simple `/link/create` endpoint 
            // is tracking via email/contact, or parsing the redirect URL if Mayar returns it in the payload.
            // For robust tracing, we can update by customer_email and customer_phone if we don't have the exact tx ID

            const email = data.customer?.email;
            const status = data.status; // usually "PAID" or "SETTLED"

            if (email && (status === 'PAID' || status === 'SETTLED')) {
                const db = await getDb();

                // Update transaction status based on email (Wait for latest pending tx)
                await db.execute({
                    sql: `
                        UPDATE transactions 
                        SET status = 'PAID' 
                        WHERE email = ? AND status = 'PENDING'
                    `,
                    args: [email]
                });

                console.log(`Successfully marked transaction for ${email} as PAID via Webhook.`);
            }
        }

        // Always return 200 OK to Mayar so they don't retry unnecessarily
        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Webhook error:', error);
        // Return 200 even on error to prevent Mayar spamming retries if it's our fault
        return NextResponse.json({ error: 'Webhook processing error' }, { status: 200 });
    }
}
