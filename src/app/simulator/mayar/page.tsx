import React from 'react';
import { getDb } from '@/lib/db';
import { redirect } from 'next/navigation';
import { ShieldCheck, CreditCard } from 'lucide-react';
import SimulatorSubmitButton from '@/components/SimulatorSubmitButton';

export const dynamic = 'force-dynamic';

export default async function MayarSimulatorPage({
    searchParams,
}: {
    searchParams: Promise<{ id?: string }>;
}) {
    const { id } = await searchParams;

    if (!id) {
        redirect('/');
    }

    const db = await getDb();
    const result = await db.execute({
        sql: 'SELECT * FROM transactions WHERE id = ?',
        args: [id]
    });

    const tx = result.rows[0] as any;

    if (!tx || tx.status === 'PAID') {
        // If invalid or already paid, redirect straight to success or home
        redirect('/success');
    }

    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">

                {/* Mayar Brand Header */}
                <div className="bg-[#0051FF] p-6 text-white text-center rounded-b-3xl shadow-sm relative z-10">
                    <h1 className="text-2xl font-black tracking-tight flex items-center justify-center gap-2">
                        <span className="bg-white text-[#0051FF] w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xl">M</span>
                        mayar <span className="text-sm font-normal opacity-75 ml-2">(Simulator)</span>
                    </h1>
                    <p className="opacity-90 text-sm mt-2">Secure Payment Gateway</p>
                </div>

                <div className="p-8 -mt-4 pt-10">
                    <div className="text-center mb-8">
                        <p className="text-slate-500 text-sm font-medium mb-1">Total Pembayaran</p>
                        <h2 className="text-4xl font-extrabold text-slate-800">
                            Rp {tx.amount.toLocaleString('id-ID')}
                        </h2>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-100 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Order ID</span>
                            <span className="font-semibold text-slate-700">#TRX-{tx.id.toString().padStart(6, '0')}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Nama Lengkap</span>
                            <span className="font-semibold text-slate-700">{tx.name}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Email Utama</span>
                            <span className="font-semibold text-slate-700">{tx.email}</span>
                        </div>
                    </div>

                    <SimulatorSubmitButton transactionId={tx.id} />

                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-6 text-center">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        <span>Ini adalah halaman simulasi untuk testing flow Mayar.</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
