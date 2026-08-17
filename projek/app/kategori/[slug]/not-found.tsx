import Link from "next/link";
import { FolderSearch } from "lucide-react";

export default function CategoryNotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <FolderSearch size={40} className="mx-auto text-ink-soft/50" aria-hidden="true" />
      <p className="mt-4 font-mono text-xs text-ink-soft">404</p>
      <h1 className="mt-2 text-2xl font-bold text-ink">Kategori tidak ditemukan</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        Kategori yang Anda cari tidak tersedia. Coba lihat daftar kategori yang ada.
      </p>
      <Link
        href="/kategori"
        className="mt-6 inline-flex items-center gap-1.5 font-medium text-brand"
      >
        ← Lihat semua kategori
      </Link>
    </div>
  );
}
