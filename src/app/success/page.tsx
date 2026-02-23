"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { CheckCircle2, ArrowLeft, Folder, PlayCircle, Youtube, Globe, DownloadCloud, Sparkles, ShieldCheck, Download } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

declare global {
    interface Window {
        fbq: any;
    }
}

const resources = [
    {
        title: "1000 Worksheet Islam",
        desc: "Sudah dilengkapi dengan Worksheet Sholat & Wudhu.",
        url: "https://drive.google.com/drive/folders/157HarZd-AGAgijGQsjfWMGAG-8sy1ywx",
        type: "drive",
        icon: Folder
    },
    {
        title: "30 Animasi Kisah Nabi & Sahabat",
        desc: "File MP4 animasi kisah inspiratif Islami siap tonton.",
        url: "https://drive.google.com/drive/folders/1JcK6t765zs09JhFBUtPVy8F3oegVGOVG",
        type: "video",
        icon: PlayCircle
    },
    {
        title: "Buku PDF Adab & Sejarah Nabi",
        desc: "Ratusan file PDF bergambar penuh warna tentang adab & akhlak sehari-hari.",
        url: "https://drive.google.com/drive/folders/1rjJDXc5xma15Z5qjUfIsTIHLrZ2OvlW2",
        type: "drive",
        icon: Folder
    },
    {
        title: "Aktivitas Hafalan & Games Logika",
        desc: "Hafalan hadis pendek, meniru huruf hijaiyah, dan games mengasah otak anak.",
        url: "https://drive.google.com/drive/folders/1KDxX3IO0dQKsriJGCFXWnNC5Gn59rlTQ",
        type: "drive",
        icon: Folder
    },
    {
        title: "Video Edukasi Anak Muslim (Yufid)",
        desc: "Ratusan video edukasi resmi (animasi wudu, salat, doa). Bisa diunduh langsung.",
        url: "https://yufid.com/category/video/video-anak/",
        type: "web",
        icon: Globe
    },
    {
        title: "Drive Public Spesial Ramadhan",
        desc: "Koleksi Super Lengkap: Worksheet + Aktivitas menyambut bulan suci.",
        url: "https://drive.google.com/drive/folders/1wWjIJGANRHtsiheDOLPtzXkrTfj5IzdP",
        type: "drive",
        icon: DownloadCloud
    },
    {
        title: "Tambahan Spesial Ramadhan",
        desc: "Koleksi Video + Audio Islami Ramadhan.",
        url: "https://drive.google.com/drive/folders/1E-E0UUk-wp0bhgJfMCZpBbjGYgcVUjsJ",
        type: "video",
        icon: PlayCircle
    },
    {
        title: "Bonus Youtube Playlist",
        desc: "Kumpulan 48 Video edukasi langsung diputar via YouTube.",
        url: "https://www.youtube.com/playlist?list=PLOA7-Gti4MVS3JbDaLCwT-pqZ-mZt2Hpw",
        type: "youtube",
        icon: Youtube
    },
    {
        title: "18 File PDF Besar (Worksheet)",
        desc: "Total ribuan halaman siap cetak/print massal.",
        url: "https://drive.google.com/drive/folders/157HarZd-AGAgijGQsjfWMGAG-8sy1ywx",
        type: "drive",
        icon: Folder
    },
    {
        title: "Bonus Spesial AI: Materi Islami Anak Eksklusif",
        desc: "Kumpulan konten edukatif Islami anak pilihan (Kurasi khusus oleh Gemini 3.1 Pro & Opus Think 4.6).",
        url: "https://drive.google.com/drive/folders/157HarZd-AGAgijGQsjfWMGAG-8sy1ywx",
        type: "drive",
        icon: Sparkles
    }
];

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const emailStr = searchParams.get('email');
    const idStr = searchParams.get('id');

    const [tx, setTx] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [emailInput, setEmailInput] = useState(emailStr || '');

    // Function to check transaction from our new edge API
    const checkTransaction = async (queryEmail: string, queryId?: string | null) => {
        if (!queryEmail && !queryId) return;

        setLoading(true);
        setErrorMsg('');

        try {
            let url = `/api/transaction/verify?`;
            const params = new URLSearchParams();
            if (queryEmail) params.append('email', queryEmail);
            if (queryId) params.append('id', queryId);
            url += params.toString();

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setTx(data.transaction);
            } else {
                setTx(null);
                if (queryEmail || queryId) {
                    setErrorMsg('Transaksi tidak ditemukan atau email salah.');
                }
            }
        } catch (err) {
            setTx(null);
            setErrorMsg('Gagal memeriksa status transaksi.');
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        if (emailStr || idStr) {
            checkTransaction(emailStr || '', idStr);
        }
    }, [emailStr, idStr]);

    // Polling logic when PENDING
    useEffect(() => {
        if (tx && tx.status === 'PENDING') {
            const interval = setInterval(() => {
                // Poll using the exact same parameters that were successful the first time
                checkTransaction(emailStr || tx.email, tx.id.toString());
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [tx, emailStr]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/success?email=${encodeURIComponent(emailInput)}`);
    };

    const isPaid = tx?.status === 'PAID';
    const isMatched = tx && emailStr && tx.email.toLowerCase() === emailStr.toLowerCase();

    // Trigger Facebook Pixel Purchase event when verification succeeds
    useEffect(() => {
        if (isPaid && isMatched && typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'Purchase', {
                currency: 'IDR',
                value: Number(tx?.amount || 10000)
            });
        }
    }, [isPaid, isMatched, tx?.amount]);

    if (!tx || !isPaid || !isMatched) {
        return (
            <main className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-neutral-200 text-center">
                    <ShieldCheck className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Cek Status Akses</h1>

                    {!tx ? (
                        <p className="text-neutral-600 mb-6">
                            Sistem sedang menyinkronkan data pembayaran dari Mayar. Silakan masukkan <strong>Email</strong> yang Anda gunakan saat pembelian untuk melacak status transaksi Anda.
                        </p>
                    ) : !isPaid ? (
                        <>
                            <p className="text-neutral-600 mb-6">
                                Trx <strong>#{tx.id}</strong> berstatus <strong>Pending</strong>. Harap selesaikan pembayaran melalui link Mayar. Sistem sedang menunggu dan akan otomatis memproses jika lunas.
                            </p>
                            <div className="flex items-center gap-3 justify-center text-sm font-medium text-amber-600 mb-6 bg-amber-50 p-3 rounded-lg border border-amber-200">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                </span>
                                Menunggu Pembayaran...
                            </div>
                        </>
                    ) : (
                        <p className="text-neutral-600 mb-6">
                            Transaksi sudah Lunas! Namun demi keamanan, konfirmasi ulang <strong>Email</strong> Anda untuk membuka brankas file.
                        </p>
                    )}

                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                            {errorMsg}
                        </div>
                    )}

                    {(!isPaid || !isMatched || !tx) && (
                        <form className="flex flex-col gap-4 text-left" onSubmit={handleSearch}>
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-neutral-700">Email Pembeli</label>
                                <input
                                    type="email"
                                    required
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    placeholder="contoh@gmail.com"
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-premium-500 focus:outline-none"
                                />
                            </div>
                            <button disabled={loading} type="submit" className="w-full bg-premium-600 hover:bg-premium-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-colors">
                                {loading ? "Memeriksa..." : (tx ? "Buka Brankas Mode Aman" : "Cek Status Pembayaran")}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-sm">
                        <Link href="/" className="text-premium-600 hover:underline">
                            Kembali ke Halaman Utama
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // Only Render Premium Content if PAID & Email matches
    return (
        <main className="min-h-screen bg-neutral-50 flex flex-col items-center py-12 px-4">
            <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100">
                <div className="text-center p-8 bg-premium-50 border-b border-premium-100">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-200">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>

                    <h1 className="text-3xl font-extrabold text-neutral-900 mb-3 tracking-tight">Pembayaran Berhasil! 🎉</h1>
                    <p className="text-lg text-neutral-600 max-w-xl mx-auto leading-relaxed">
                        Terima kasih {tx.name} atas apresiasi Anda. Seluruh akses ke <strong>14.000++ Worksheet Anak</strong> dan berbagai bonus premium lainnya sudah bisa diunduh di bawah ini.
                    </p>
                </div>

                <div className="p-8">
                    <h2 className="text-xl font-bold text-premium-800 mb-6 flex items-center">
                        <Download className="w-6 h-6 mr-3 text-premium-600" />
                        Daftar Link Akses Materi Anda
                    </h2>

                    <div className="space-y-4">
                        {resources.map((item, idx) => (
                            <div key={idx} className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white rounded-2xl border border-neutral-200 shadow-sm hover:border-premium-300 hover:shadow-md transition-all gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-premium-100 text-premium-600 p-3 rounded-xl shrink-0 mt-0.5 sm:mt-0">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 text-lg group-hover:text-premium-700 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-neutral-500 mt-1">{item.desc}</p>
                                    </div>
                                </div>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto shrink-0 bg-neutral-900 hover:bg-premium-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    Buka Link
                                </a>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 pt-8 border-t border-neutral-100 text-center">
                        <p className="text-sm text-neutral-500 mb-6 max-w-md mx-auto">
                            Disarankan untuk menyimpan (bookmark) tautan ini jika Anda belum mengunduh semua materi. Link ini dienkripsi dengan Email Anda.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 bg-neutral-200 rounded-full mb-4"></div>
                    <div className="h-6 w-48 bg-neutral-200 rounded mb-2"></div>
                    <div className="h-4 w-32 bg-neutral-200 rounded"></div>
                </div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
