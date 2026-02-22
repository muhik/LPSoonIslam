import React from 'react';
import { CheckCircle, ExternalLink, ArrowLeft, Folder, PlayCircle, Youtube, Globe, DownloadCloud, Sparkles } from 'lucide-react';
import Link from 'next/link';

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

export default function SuccessPage() {
    return (
        <main className="min-h-screen bg-neutral-50 flex flex-col items-center py-12 px-4">
            <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100">
                {/* Header Area */}
                <div className="text-center p-8 bg-premium-50 border-b border-premium-100">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-200">
                        <CheckCircle className="w-10 h-10" />
                    </div>

                    {/* Facebook Pixel Tracking for Purchase */}
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                          if (typeof fbq === 'function') {
                            fbq('track', 'Purchase', { currency: 'IDR', value: 10000 });
                          }
                        `,
                        }}
                    />

                    <h1 className="text-3xl font-extrabold text-neutral-900 mb-3 tracking-tight">Pembayaran Berhasil! 🎉</h1>
                    <p className="text-lg text-neutral-600 max-w-xl mx-auto leading-relaxed">
                        Terima kasih atas apresiasi Anda. Seluruh akses ke <strong>14.000++ Worksheet Anak</strong> dan berbagai bonus premium lainnya sudah bisa diakses di bawah ini.
                    </p>
                </div>

                {/* Content Area */}
                <div className="p-8">
                    <h2 className="text-xl font-bold text-premium-800 mb-6 flex items-center">
                        <DownloadCloud className="w-6 h-6 mr-3 text-premium-600" />
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
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 pt-8 border-t border-neutral-100 text-center">
                        <p className="text-sm text-neutral-500 mb-6 max-w-md mx-auto">
                            Disarankan untuk menyimpan (bookmark) halaman ini jika Anda belum mengunduh semua materi. Semua link bersifat publik / viewer-only pada Drive Anda.
                        </p>
                        <Link href="/" className="inline-flex items-center text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors bg-neutral-100 hover:bg-neutral-200 px-6 py-3 rounded-full">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Halaman Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
