import React from 'react';
import { CheckCircle2, Download, Star, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import CheckoutForm from '@/components/CheckoutForm';

export default function Home() {
    return (
        <main className="min-h-screen bg-checkerboard shadow-vignette text-neutral-900 pb-20">
            {/* Navbar / Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="font-bold text-xl tracking-tight text-premium-600">eBookPremium</div>
                    <div className="flex items-center gap-4">
                        <Link href="/akses" className="text-sm font-semibold text-neutral-600 hover:text-premium-600 transition-colors hidden sm:block">
                            Akses Pembelian
                        </Link>
                        <Link href="#checkout" className="bg-premium-600 hover:bg-premium-700 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-sm text-sm">
                            Beli Sekarang
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
                <div className="inline-block bg-premium-100 text-premium-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                    🌟 Promo Spesial Hari Ini
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                    14.000++ Worksheet Anak Eksklusif Berkualitas
                </h1>
                <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
                    Dapatkan ribuan materi edukatif anak terlengkap. <strong>Dipakai sendiri bikin pintar, dijual lagi bikin cuan!</strong>
                </p>

                {/* DANA Cashback Badge */}
                <div className="bg-gradient-to-r from-[#118EEA] to-[#0ea5e9] text-white p-4 rounded-2xl shadow-xl mb-10 max-w-2xl mx-auto flex items-center justify-center gap-4 border-2 border-[#118EEA]/20 transform hover:-translate-y-1 transition-transform cursor-default relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <span className="text-4xl animate-bounce drop-shadow-md">💸</span>
                    <div className="text-left z-10">
                        <p className="font-extrabold text-sm md:text-base uppercase tracking-wider text-yellow-300 drop-shadow-sm">
                            🔥 SUPER PROMO HARI INI
                        </p>
                        <p className="text-sm md:text-base text-white font-medium mt-0.5 leading-snug">
                            Khusus 50 Pembeli Pertama Dapat <strong>CASHBACK Saldo DANA!</strong>
                        </p>
                    </div>
                </div>

                {/* Product Images */}
                <div className="relative w-full max-w-2xl mx-auto flex flex-col gap-8 mb-12 items-center justify-center">
                    <img
                        src="/ebook_ke2.png"
                        alt="Bundle 14.000+ Worksheet Anak Islam"
                        className="w-full h-auto rounded-3xl shadow-2xl border border-neutral-200 object-contain hover:scale-[1.02] transition-transform duration-500 cursor-pointer"
                    />
                    <img
                        src="/iklanpapanworksheet.jpg?v=2"
                        alt="Detail Isi Produk"
                        className="w-full max-w-sm h-auto mx-auto rounded-3xl shadow-2xl border border-neutral-200 object-contain hover:scale-[1.02] transition-transform duration-500 cursor-pointer"
                    />
                </div>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto text-left mb-16">
                    {[
                        "Akses seumur hidup via Google Drive",
                        "Lisensi Bisnis PLR (Bebas Dijual Ulang, Untung 100% Milik Anda)",
                        "Ribuan materi siap print (PDF berkualitas)",
                        "Bonus materi edukasi tambahan",
                        "Harga promo termurah (Akses Penuh Selamanya)"
                    ].map((feature, i) => (
                        <div key={i} className="flex items-start bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
                            <CheckCircle2 className="w-5 h-5 text-premium-500 mt-0.5 shrink-0" />
                            <span className="ml-3 font-medium text-neutral-700">{feature}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Description / Story Section */}
            <section className="bg-white py-16 border-y border-neutral-200">
                <div className="max-w-3xl mx-auto px-4 space-y-6 text-lg text-neutral-700 leading-relaxed">
                    <p>
                        🔥 <strong>Bunda, masa keemasan anak tak akan pernah terulang.</strong> Berikan mereka stimulus terbaik di usia pertumbuhannya! 😍
                    </p>
                    <p>
                        <strong>14.000+ ASET PENDIDIKAN DAN BERBAGAI BONUS KONTEN EKSKLUSIF</strong> 🎉
                    </p>
                    <p>
                        Alihkan sejenak <em>gadget</em> mereka dengan aktivitas fisik yang mengasah otak dan kemampuan motoriknya. Terdiri dari ratusan materi bernuansa Islami (Sholat, Wudhu, Menulis Huruf Hijaiyah) dan puluhan ribu materi berhitung, mewarnai, serta aneka <em>games</em> visual lainnya.
                    </p>
                    <p>
                        <em>Berapa harga investasi pendidikan ini?</em> Di luar sana, kumpulan buku senilai belasan ribu halaman bisa memakan biaya ratusan ribu hingga jutaan rupiah. Namun, khusus hari ini kami memberikan harga pangkas habis-habisan!
                    </p>
                    <p>
                        Menariknya lagi, Bundle 14.000+ Aset ini dilengkapi dengan <strong>Lisensi Bisnis PLR (Private Label Rights)</strong>. Artinya Bunda tidak hanya berinvestasi untuk kecerdasan anak, tapi Bunda punya Hak Penuh untuk menjual ulang seluruh file PDF ini berkali-kali! Bayangkan modal cuma Rp35.000, Bunda bisa langsung balik modal (BEP) hanya dengan 1 pembeli pertama. Gimana kalau laku puluhan kali?
                    </p>
                    <p>
                        Miliki ribuan aset file cemerlang dan mesin uang digital ini <strong>hanya mulai dari Rp35.000 saja</strong>. Sekali bayar untuk ilmu dan modal bisnis seumur hidup. Silakan selesaikan pembayaran Bunda hari ini sebelum harga promo kami tarik kembali! 💖
                    </p>
                </div>
            </section>

            {/* Checkout Section CTA */}
            <section id="checkout" className="max-w-2xl mx-auto px-4 mt-16">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-neutral-200 sticky top-24">
                    <h2 className="text-2xl font-bold mb-6 text-center">Checkout &amp; Dapatkan Akses</h2>

                    <CheckoutForm />
                </div>
            </section>

        </main>
    );
}
