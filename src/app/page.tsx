import React from 'react';
import { CheckCircle2, Download, Star, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import CheckoutForm from '@/components/CheckoutForm';

export default function Home() {
    return (
        <main className="min-h-screen bg-neutral-50 text-neutral-900 pb-20">
            {/* Navbar / Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="font-bold text-xl tracking-tight text-premium-600">eBookPremium</div>
                    <Link href="#checkout" className="bg-premium-600 hover:bg-premium-700 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-sm">
                        Beli Sekarang
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
                <div className="inline-block bg-premium-100 text-premium-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                    🌟 Promo Spesial Hari Ini
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                    14.000++ Worksheet Anak (Versi Bayar Seikhlasnya)
                </h1>
                <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
                    Dapatkan ribuan materi edukatif anak lengkap dalam satu link Google Drive. Tinggal download dan print!
                </p>

                {/* Product Images */}
                <div className="relative w-full max-w-2xl mx-auto flex flex-col gap-8 mb-12 items-center justify-center">
                    <img
                        src="/ebook_ke2.png"
                        alt="Bundle 14.000+ Worksheet Anak Islam"
                        className="w-full h-auto rounded-3xl shadow-2xl border border-neutral-200 object-contain hover:scale-[1.02] transition-transform duration-500 cursor-pointer"
                    />
                    <img
                        src="/tampak_depan.jpeg"
                        alt="Detail Isi Produk"
                        className="w-full h-auto rounded-3xl shadow-2xl border border-neutral-200 object-contain hover:scale-[1.02] transition-transform duration-500 cursor-pointer"
                    />
                </div>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto text-left mb-16">
                    {[
                        "Akses seumur hidup via Google Drive",
                        "Ribuan materi siap print (PDF berkualitas)",
                        "Bonus materi edukasi tambahan",
                        "Harga spesial hanya hari ini (Bayar Seikhlasnya!)"
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
                        🔥 <strong>Silakan isi nominal terbaik</strong> dari kakak sebagai penyemangat kami &amp; semakin semangat buat update produk keren lainnya! 😍
                    </p>
                    <p>
                        <strong>14.000 ASET PENDIDIKAN + MODAL BISNIS DALAM SATU KLIK (BAYAR SEIKHLASNYA)</strong> 🎉🥳
                    </p>
                    <p>
                        Mau bikin anak pinter sekaligus punya aset digital buat dijual lagi? Ini solusinya! Kami rangkum 2.000+ Worksheet Muslim, 12.000+ Worksheet Umum.
                    </p>
                    <p>
                        <em>Kenapa Harganya Terserah Anda?</em> Kami ingin berbagi manfaat seluas-luasnya. Ilmu tidak boleh mahal. Namun, di balik kemudahan ini, ada tim yang bekerja keras menyortir ribuan file agar siap Kakak pakai.
                    </p>
                    <p>
                        Oleh karena itu, mohon maaf sebelumnya ya Kak 🙏. Izin kami menetapkan apresiasi <strong>minimal Rp10.000 saja</strong>. Anggaplah nominal ini sebagai pengganti "biaya penyetoran konten" (iklan) agar info ini bisa sampai ke beranda Kakak. Selebihnya? Terserah keikhlasan Kakak. 💖
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
