'use client';

import React, { useState } from 'react';
import { Download, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

declare global {
    interface Window {
        fbq: any;
    }
}

export default function CheckoutForm() {
    const router = useRouter();
    const [amount, setAmount] = useState('35000');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e?: React.FormEvent, isBypass = false) => {
        if (e) e.preventDefault();
        setLoading(true);

        const payload = new FormData();
        payload.append('amount', amount);
        payload.append('name', name);
        payload.append('email', email);
        payload.append('phone', phone);

        try {
            // Track AddToCart / InitiateCheckout event for Facebook Pixel
            if (typeof window !== 'undefined' && window.fbq) {
                window.fbq('track', 'InitiateCheckout', {
                    currency: 'IDR',
                    value: Number(amount)
                });
            }

            const response = await fetch('/api/checkout', {
                method: 'POST',
                body: payload,
                redirect: 'follow'
            });

            if (response.redirected) {
                router.push(response.url);
            } else if (response.ok) {
                const data = await response.json();
                console.log("Checkout success, redirecting to:", data.url);
                if (data.url) {
                    router.push(data.url);
                }
            } else {
                let errorMessage = "Terjadi kesalahan saat checkout.";
                try {
                    const data = await response.json();
                    if (data.error) errorMessage = data.error;
                } catch (e) {
                    errorMessage = await response.text();
                }
                console.error("Failed to checkout:", errorMessage);
                alert(`Gagal diproses: ${errorMessage}\n\nSilakan coba lagi dengan nominal yang berbeda.`);
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Koneksi bermasalah.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Trust / Value Proposition Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 shadow-sm">
                <p className="flex items-start gap-2">
                    <span className="text-xl">💡</span>
                    <span>
                        <strong>Keputusan Tepat!</strong> Hanya dengan investasi senilai 1 cangkir kopi (Rp35.000), Bunda sudah mendapatkan akses <strong>14.000+ Aset Digital Edukatif</strong> plus <strong>Hak Jual Ulang 100% Profit</strong> seumur hidup.
                    </span>
                </p>
            </div>

            <div className="text-center pt-2">
                <p className="text-neutral-600 mb-4 font-medium">Klik tombol di bawah untuk pesan langsung via WhatsApp Admin kami:</p>
                <a
                    href="https://wa.me/6289666639360?text=Halo%20Kak%20Azlan,%20saya%20Fix%20mau%20Pesan%20Bundle%2014.000%20Worksheet%20PLR-nya%20seharga%20Rp35.000.%20Boleh%20minta%20nomor%20rekeningnya?"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                        if (typeof window !== 'undefined' && window.fbq) {
                            window.fbq('track', 'InitiateCheckout', { currency: 'IDR', value: 35000 });
                        }
                    }}
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                    </svg>
                    Pesan Sekarang via WhatsApp
                </a>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-neutral-500 mt-4">
                <ShieldCheck className="w-4 h-4 text-[#25D366]" />
                <span>Transaksi Manual via Chat Admin</span>
            </div>
        </div>
    );
}
