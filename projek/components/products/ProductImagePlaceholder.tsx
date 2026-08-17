import { ImageOff } from "lucide-react";
import { getCategoryByName } from "@/lib/categories/data";

// Belum ada aset foto produk sungguhan, jadi galeri produk memakai
// placeholder deterministik (warna + ikon per kategori, dari
// lib/categories/data.ts) alih-alih gambar asli. Field `images` di
// data/products.json berisi seed string (mis. "p01-1"), bukan URL —
// komponen ini yang menerjemahkan seed + kategori jadi tampilan visual.
// Kalau nanti ada foto asli, tinggal ganti isi `images` jadi URL sungguhan
// dan ganti pemakaian komponen ini dengan <img>/<Image> biasa, tanpa perlu
// ubah bentuk data.
const VARIANT_LABELS = ["Tampak depan", "Tampak samping", "Detail"];

export default function ProductImagePlaceholder({
  category,
  variantIndex = 0,
  className = "",
  iconSize = 40,
}: {
  category: string;
  variantIndex?: number;
  className?: string;
  iconSize?: number;
}) {
  const categoryInfo = getCategoryByName(category);
  const gradient = categoryInfo?.gradient ?? "from-slate-100 to-slate-50";
  const Icon = categoryInfo?.icon ?? ImageOff;
  const label = VARIANT_LABELS[variantIndex % VARIANT_LABELS.length];

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br ${gradient} ${className}`}
    >
      <Icon size={iconSize} strokeWidth={1.5} className="text-ink-soft/50" aria-hidden="true" />
      <span className="font-mono text-[9.5px] text-ink-soft/70">{label}</span>
    </div>
  );
}
