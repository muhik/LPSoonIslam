export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const amount = formData.get('amount') as string;

        const db = await getDb();

        // Store the order in our local SQLite database
        const info = await db.execute({
            sql: `
            INSERT INTO transactions (name, email, phone, amount)
            VALUES (?, ?, ?, ?)
          `,
            args: [name, email, phone, parseInt(amount, 10)]
        });

        const newId = info.lastInsertRowid?.toString();

        console.log('Transaction recorded:', { name, email, phone, amount, id: newId });

        // Generate Mayar Payment Link
        const mayarApiKey = process.env.MAYAR_API_KEY;
        if (!mayarApiKey) {
            console.warn('MAYAR_API_KEY is not set. Falling back to simulator.');
            return NextResponse.json({ url: `/simulator/mayar?id=${newId}` });
        }

        // Domain to redirect back to (Use localhost for dev, garasiduaroda/soonislam for prod)
        // Since we are running in Cloudflare, we use the incoming request URL
        const requestUrl = new URL(request.url);
        const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;

        const mayarResponse = await fetch('https://api.mayar.id/hl/v1/payment/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${mayarApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: `Akses 14.000 Worksheet (Bayar Seikhlasnya)`,
                description: `Pembelian produk digital edukasi oleh ${name}`,
                amount: parseInt(amount, 10),
                customer_name: name,
                email: email,
                mobile: phone,
                redirect_url: `${baseUrl}/success?id=${newId}&email=${encodeURIComponent(email)}`,
                is_open_amount: false,
                is_quantity: false,
                is_amount_custom: false
            })
        });

        if (!mayarResponse.ok) {
            const errText = await mayarResponse.text();
            console.error('Failed to create Mayar link:', errText);
            return NextResponse.json({ error: `Mayar Error: ${errText}` }, { status: mayarResponse.status });
        }

        const mayarData = await mayarResponse.json();

        if (mayarData?.statusCode !== 200 || !mayarData?.data?.link) {
            console.error('Invalid response from Mayar:', mayarData);
            return NextResponse.json({ error: `Mayar Invalid Structure: ${JSON.stringify(mayarData)}` }, { status: 500 });
        }

        // Return the Mayar URL to the client
        return NextResponse.json({ url: mayarData.data.link });

    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: `Server Error: ${error.message || 'Unknown'}` }, { status: 500 });
    }
}
