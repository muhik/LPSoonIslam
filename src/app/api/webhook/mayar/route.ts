export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const rawBody = await request.text();
        const signatureHeader = request.headers.get('x-mayar-signature');
        const webhookToken = process.env.MAYAR_WEBHOOK_TOKEN;
        const db = await getDb();

        // Verify HMAC if Webhook Token is configured
        if (webhookToken && signatureHeader) {
            const encoder = new TextEncoder();
            const keyData = encoder.encode(webhookToken);

            const cryptoKey = await crypto.subtle.importKey(
                'raw',
                keyData,
                { name: 'HMAC', hash: 'SHA-256' },
                false,
                ['verify']
            );

            // Mayar signature is expected to be a hex string, but WebCrypto verify takes ArrayBuffer
            // We need to generate the HMAC ourselves and compare the hex strings
            const signKey = await crypto.subtle.importKey(
                'raw',
                keyData,
                { name: 'HMAC', hash: 'SHA-256' },
                false,
                ['sign']
            );

            const signatureBuffer = await crypto.subtle.sign(
                'HMAC',
                signKey,
                encoder.encode(rawBody)
            );

            const signatureArray = Array.from(new Uint8Array(signatureBuffer));
            const expectedSignatureHex = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');

            if (expectedSignatureHex !== signatureHeader) {
                console.error('Invalid Mayar webhook signature');

                // Track signature mismatch
                await db.execute({
                    sql: "INSERT INTO webhook_logs (payload) VALUES (?)",
                    args: [`[INVALID_SIG] Expected: ${expectedSignatureHex}, Got: ${signatureHeader} | Body: ${rawBody}`]
                });

                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        const body = JSON.parse(rawBody);
        const event = body.event;
        const data = body.data;

        await db.execute({
            sql: "INSERT INTO webhook_logs (payload) VALUES (?)",
            args: [rawBody]
        });

        console.log('Received Mayar Webhook:', JSON.stringify({ event, invoice_id: data?.id }, null, 2));

        // Let's accept ANY event name (payment.success, payment.received, invoice.paid, etc.)
        // as long as the status is PAID or SETTLED and email matches
        const email = data?.customer?.email || data?.customer_email || body?.customer_email || data?.email;
        const status = data?.status || body?.status;

        if (email && (status === 'PAID' || status === 'SETTLED' || status === 'paid' || status === 'SUCCESS')) {
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

        // Always return 200 OK to Mayar so they don't retry unnecessarily
        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Webhook error:', error);
        // Return 200 even on error to prevent Mayar spamming retries if it's our fault
        return NextResponse.json({ error: 'Webhook processing error' }, { status: 200 });
    }
}
