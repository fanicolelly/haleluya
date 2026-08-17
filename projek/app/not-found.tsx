import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl py-16 text-center">
      <p className="font-mono text-xs text-ink-soft">404</p>
      <h1 className="mt-3 text-3xl font-bold text-ink">Halaman tidak ditemukan</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        Fitur atau halaman yang Anda cari belum ada di BelanjAI.
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
