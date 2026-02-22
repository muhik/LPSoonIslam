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

        // Return the URL as JSON so the client-side fetch can redirect safely
        return NextResponse.json({ url: `/simulator/mayar?id=${newId}` });

    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
