import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const transactionId = formData.get('transaction_id') as string;

        if (!transactionId) {
            return NextResponse.json({ error: 'Missing transaction ID' }, { status: 400 });
        }

        const db = await getDb();

        // Update status to PAID
        await db.execute({
            sql: `
                UPDATE transactions 
                SET status = 'PAID' 
                WHERE id = ?
            `,
            args: [Number(transactionId)]
        });

        console.log('Transaction marked as PAID via Simulator:', transactionId);

        // Return JSON with the success URL
        return NextResponse.json({ url: '/success?status=paid' });

    } catch (error) {
        console.error('Payment simulator error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
