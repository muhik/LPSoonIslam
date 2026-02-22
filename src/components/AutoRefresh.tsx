'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AutoRefreshProps {
    id: string;
    email: string;
}

export default function AutoRefresh({ id, email }: AutoRefreshProps) {
    const router = useRouter();

    useEffect(() => {
        // Cek status ke API setiap 3 detik
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/transaction/${id}?email=${encodeURIComponent(email)}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.status === 'PAID') {
                        console.log('Payment detected as PAID. Refreshing page...');
                        clearInterval(interval); // Hentikan pengecekan
                        router.refresh(); // Refresh halaman (Server Component akan memuat versi Premium)

                        // Fallback full reload jika Next.js router.refresh tidak langsung merender ulang
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    }
                }
            } catch (error) {
                console.error('Failed to poll transaction status:', error);
            }
        }, 3000); // 3000 ms = 3 detik

        // Cleanup interval saat komponen hancur/berubah
        return () => clearInterval(interval);
    }, [id, email, router]);

    return (
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-neutral-400">
            <div className="w-3 h-3 rounded-full border-2 border-neutral-300 border-t-premium-500 animate-spin"></div>
            <span>Auto-refresh aktif. Menunggu sinyal pembayaran...</span>
        </div>
    );
}
