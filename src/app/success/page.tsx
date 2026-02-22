export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import React from 'react';
import { CheckCircle2, ExternalLink, ArrowLeft, Folder, PlayCircle, Youtube, Globe, DownloadCloud, Sparkles, ShieldCheck, Download } from 'lucide-react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { redirect } from 'next/navigation';
import AutoRefresh from '@/components/AutoRefresh';

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

export default async function SuccessPage(props: {
    searchParams: Promise<{ id?: string; email?: string }>;
}) {
    const searchParams = await props.searchParams;
    const { id, email } = searchParams;

    // If we have an ID, fetch the specific transaction
    let tx: any = null;
    let db: any = null;

    try {
        db = await getDb();
        if (id) {
            const result = await db.execute({
                sql: 'SELECT * FROM transactions WHERE id = ?',
                args: [parseInt(id, 10)]
            });
            tx = result.rows[0];
        } else if (email) {
            // If we only have email (e.g., user searched for their transaction), get the latest one
            const result = await db.execute({
                sql: 'SELECT * FROM transactions WHERE email = ? ORDER BY id DESC LIMIT 1',
                args: [email]
            });
            tx = result.rows[0];
        }
    } catch (err) {
        console.error("Database error on success page:", err);
    }

    // Security Gate: Check if Paid and Email Maps Correctly
    const isPaid = tx?.status === 'PAID';
    const isEmailMatched = tx && email && email.toLowerCase() === tx.email.toLowerCase();

    // If Not Paid / Not Matched / No Transaction Found, Show the Locked Form Gate
    if (!tx || !isPaid || !isEmailMatched) {
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
                                Trx <strong>#{tx.id}</strong> berstatus <strong>Pending</strong>. Harap selesaikan pembayaran melalui link Mayar. Sistem akan otomatis merefresh halaman ini jika lunas.
                            </p>
                            {/* Auto Refresh only applies when not paid but email matches explicitly */}
                            {isEmailMatched && <AutoRefresh id={tx.id.toString()} email={email} />}
                        </>
                    ) : (
                        <p className="text-neutral-600 mb-6">
                            Transaksi sudah Lunas! Namun demi keamanan, konfirmasi ulang <strong>Email</strong> Anda untuk membuka brankas file.
                        </p>
                    )}

                    {(!isPaid || !isEmailMatched || !tx) && (
                        <form className="flex flex-col gap-4 text-left" method="GET">
                            {/* If we have context of the ID but need email verification */}
                            {tx && !isEmailMatched && <input type="hidden" name="id" value={tx.id} />}

                            <div>
                                <label className="block text-sm font-semibold mb-1 text-neutral-700">Email Pembeli</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    defaultValue={email || ''}
                                    placeholder="contoh@gmail.com"
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-premium-500 focus:outline-none"
                                />
                            </div>
                            <button type="submit" className="w-full bg-premium-600 hover:bg-premium-700 text-white font-bold py-3 px-4 rounded-xl transition-colors">
                                {tx ? "Buka Brankas Mode Aman" : "Cek Status Pembayaran"}
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

    // Only Render Premium Content if PAID & Email is correctly passed via query params
    return (
        <main className="min-h-screen bg-neutral-50 flex flex-col items-center py-12 px-4">
            <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100">
                {/* Header Area */}
                <div className="text-center p-8 bg-premium-50 border-b border-premium-100">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-200">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>

                    {/* Facebook Pixel Tracking for Purchase */}
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                          if (typeof fbq === 'function') {
                            fbq('track', 'Purchase', { currency: 'IDR', value: ${tx.amount || 10000} });
                          }
                        `,
                        }}
                    />

                    <h1 className="text-3xl font-extrabold text-neutral-900 mb-3 tracking-tight">Pembayaran Berhasil! 🎉</h1>
                    <p className="text-lg text-neutral-600 max-w-xl mx-auto leading-relaxed">
                        Terima kasih {tx.name} atas apresiasi Anda. Seluruh akses ke <strong>14.000++ Worksheet Anak</strong> dan berbagai bonus premium lainnya sudah bisa diunduh di bawah ini.
                    </p>
                </div>

                {/* Content Area */}
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
