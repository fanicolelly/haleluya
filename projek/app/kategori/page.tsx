import Link from "next/link";
import { CATEGORIES } from "@/lib/categories/data";
import { getProductsByCategory } from "@/lib/products/catalog";

export const metadata = {
  title: "Kategori — BelanjAI",
};

export default function KategoriPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Kategori</h1>
      <p className="mt-2 text-sm text-ink-soft">Jelajahi produk berdasarkan kategori.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => {
          const productCount = getProductsByCategory(category.name).length;
          const Icon = category.icon;

          return (
            <Link
              key={category.slug}
              href={`/kategori/${category.slug}`}
              className="group rounded-2xl border border-line bg-card p-5 transition-colors hover:border-brand/40"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${category.badge}`}
              >
                <Icon size={20} aria-hidden="true" />
              </span>
              <p className="mt-4 text-base font-semibold text-ink">{category.name}</p>
              <p className="mt-1 font-mono text-xs text-ink-soft">{productCount} produk</p>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">{category.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
