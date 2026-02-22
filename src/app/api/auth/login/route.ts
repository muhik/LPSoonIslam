export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        const db = await getDb();

        const row = await db.execute({
            sql: 'SELECT value FROM settings WHERE key = ?',
            args: ['admin_password_hash']
        });

        if (row.rows.length === 0) {
            return NextResponse.json({ error: 'Database settings not initialized' }, { status: 500 });
        }

        const adminPasswordHash = row.rows[0].value as string;
        const isValid = await bcrypt.compare(password, adminPasswordHash);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
        }

        // Passwords match, create session
        const sessionData = { role: 'admin' };
        const encryptedSessionData = await encrypt(sessionData);

        const cookieStore = await cookies();
        cookieStore.set('admin_session', encryptedSessionData, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
