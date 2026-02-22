'use client';

import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';

export default function SimulatorSubmitButton({ transactionId }: { transactionId: string | number }) {
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('transaction_id', transactionId.toString());

            const res = await fetch('/api/simulator/pay', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                if (data.url) {
                    window.location.href = data.url;
                }
            } else {
                alert("Simulasi pembayaran gagal.");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-[#0051FF] hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
            <CreditCard className="w-5 h-5" />
            {loading ? "Memproses..." : "Simulasi Bayar Sekarang"}
        </button>
    );
}
