"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, PackageSearch } from "lucide-react";
import type { Product } from "@/lib/products/types";
import ProductCard from "@/components/products/ProductCard";
import CategoryFilterBar, { type SortOption } from "@/components/categories/CategoryFilterBar";

const PAGE_SIZE = 6;

export default function CategoryProductBrowser({ products }: { products: Product[] }) {
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("terbaru");
  const [page, setPage] = useState(1);

  const filteredAndSorted = useMemo(() => {
    const min = priceMin ? Number(priceMin) : -Infinity;
    const max = priceMax ? Number(priceMax) : Infinity;

    const filtered = products.filter(
      (product) => product.price >= min && product.price <= max && product.rating >= minRating,
    );

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "harga-asc":
          return a.price - b.price;
        case "harga-desc":
          return b.price - a.price;
        case "rating-desc":
          return b.rating - a.rating;
        case "terbaru":
        default:
          // Belum ada field tanggal ditambahkan di data produk, jadi id
          // (mis. "p40" lebih baru dari "p01") dipakai sebagai proxy
          // sederhana untuk "terbaru".
          return b.id.localeCompare(a.id);
      }
    });

    return sorted;
  }, [products, priceMin, priceMax, minRating, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filteredAndSorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [priceMin, priceMax, minRating, sortBy]);

  function handleReset() {
    setPriceMin("");
    setPriceMax("");
    setMinRating(0);
    setSortBy("terbaru");
  }

  return (
    <div>
      <CategoryFilterBar
        priceMin={priceMin}
        priceMax={priceMax}
        onPriceMinChange={setPriceMin}
        onPriceMaxChange={setPriceMax}
        minRating={minRating}
        onMinRatingChange={setMinRating}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onReset={handleReset}
      />

      <p className="mt-4 font-mono text-xs text-ink-soft">
        Menampilkan {pageItems.length} dari {filteredAndSorted.length} produk
      </p>

      {filteredAndSorted.length === 0 ? (
        <div className="mt-4 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-card px-6 py-16 text-center">
          <PackageSearch size={32} className="text-ink-soft/50" aria-hidden="true" />
          <p className="text-sm font-medium text-ink">Tidak ada produk yang cocok</p>
          <p className="text-xs text-ink-soft">
            Coba ubah rentang harga atau rating minimum yang Anda pilih.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-2 rounded-xl bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand-dark"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {pageItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={safePage <= 1}
                aria-label="Halaman sebelumnya"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-soft hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="font-mono text-xs text-ink-soft">
                Halaman {safePage} dari {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                disabled={safePage >= totalPages}
                aria-label="Halaman selanjutnya"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-soft hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
