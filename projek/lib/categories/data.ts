import type { LucideIcon } from "lucide-react";
import { Dumbbell, Smartphone, UtensilsCrossed, Shirt, Sparkles } from "lucide-react";

export interface CategoryInfo {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  gradient: string; // kelas Tailwind untuk latar placeholder gambar
  badge: string; // kelas Tailwind untuk badge/ikon bulat
}

// Sumber tunggal info kategori — dipakai bersama oleh placeholder gambar
// produk, breadcrumb halaman detail, dan halaman /kategori & /kategori/[slug].
export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "olahraga",
    name: "Olahraga",
    description: "Perlengkapan lari, yoga, hiking, dan gaya hidup aktif.",
    icon: Dumbbell,
    gradient: "from-emerald-100 to-emerald-50",
    badge: "bg-emerald-50 text-emerald-700",
  },
  {
    slug: "elektronik",
    name: "Elektronik",
    description: "Gadget, aksesori, dan perangkat elektronik untuk kebutuhan harian.",
    icon: Smartphone,
    gradient: "from-blue-100 to-blue-50",
    badge: "bg-blue-50 text-blue-700",
  },
  {
    slug: "rumah-tangga",
    name: "Rumah Tangga",
    description: "Peralatan dapur dan rumah tangga untuk kebutuhan sehari-hari.",
    icon: UtensilsCrossed,
    gradient: "from-amber-100 to-amber-50",
    badge: "bg-amber-50 text-amber-700",
  },
  {
    slug: "fashion",
    name: "Fashion",
    description: "Pakaian dan aksesori kasual untuk berbagai gaya.",
    icon: Shirt,
    gradient: "from-violet-100 to-violet-50",
    badge: "bg-violet-50 text-violet-700",
  },
  {
    slug: "kecantikan",
    name: "Kecantikan",
    description: "Perawatan kulit, wajah, dan tubuh untuk rutinitas kecantikan.",
    icon: Sparkles,
    gradient: "from-rose-100 to-rose-50",
    badge: "bg-rose-50 text-rose-700",
  },
];

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}

export function getCategoryByName(name: string): CategoryInfo | undefined {
  return CATEGORIES.find((category) => category.name === name);
}
