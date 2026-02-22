import React from 'react';
import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await requireAuth();

    if (!session) {
        redirect('/admin/login');
    }

    return (
        <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-white border-r border-neutral-200">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-premium-600">Admin Panel</h2>
                </div>
                <nav className="px-4 py-2 space-y-1">
                    <Link href="/admin" className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg">
                        Dashboard
                    </Link>
                    <Link href="/admin/settings" className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg">
                        Settings
                    </Link>
                    <form action="/api/auth/logout" method="POST" className="block">
                        <button type="submit" className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                            Logout
                        </button>
                    </form>
                </nav>
            </aside>
            <main className="flex-1 p-6 md:p-8">
                {children}
            </main>
        </div>
    );
}
