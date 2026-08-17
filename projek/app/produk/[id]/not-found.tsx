import Link from "next/link";
import { PackageSearch } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <PackageSearch size={40} className="mx-auto text-ink-soft/50" aria-hidden="true" />
      <p className="mt-4 font-mono text-xs text-ink-soft">404</p>
      <h1 className="mt-2 text-2xl font-bold text-ink">Produk tidak ditemukan</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        Produk yang Anda cari mungkin sudah tidak tersedia atau tautannya salah. Coba
        kembali ke beranda dan cari produk lain.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-1.5 font-medium text-brand"
      >
        ← Kembali ke beranda
      </Link>
    </div>
  );
}
