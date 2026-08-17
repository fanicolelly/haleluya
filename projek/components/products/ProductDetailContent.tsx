"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/products/types";
import ProductDetailSkeleton from "@/components/products/ProductDetailSkeleton";
import ProductGallery from "@/components/products/ProductGallery";
import ProductInfo from "@/components/products/ProductInfo";
import ProductSpecs from "@/components/products/ProductSpecs";
import SimilarProducts from "@/components/products/SimilarProducts";

// Data produk di sini sebenarnya sudah tersedia sinkron (dibaca dari JSON
// statis saat build) — tidak ada fetch async sungguhan. State loading di
// bawah sengaja disimulasikan (jeda singkat) supaya UI-nya benar-benar ada
// dan berfungsi, sekaligus jadi tempat yang tepat untuk dipasangi fetch
// async sungguhan nanti kalau katalog ini dipindah ke database.
//
// CATATAN: sengaja TIDAK memakai konvensi loading.tsx/Suspense bawaan
// Next.js di sini — pada percobaan awal, kombinasi loading.tsx dengan
// halaman yang sepenuhnya statis (generateStaticParams) membuat boundary
// streaming-nya macet permanen (placeholder tidak pernah diganti konten
// asli, bahkan di production build). Pendekatan client-side ini lebih
// sederhana dan sudah diverifikasi berfungsi.
const SIMULATED_DELAY_MS = 500;

export default function ProductDetailContent({
  product,
  similarProducts,
}: {
  product: Product;
  similarProducts: Product[];
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), SIMULATED_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div role="status" aria-live="polite">
        <span className="sr-only">Memuat detail produk...</span>
        <ProductDetailSkeleton />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProductGallery product={product} />
        <ProductInfo product={product} />
      </div>

      <div className="mt-12">
        <ProductSpecs specs={product.specs} />
      </div>

      <div className="mt-12">
        <SimilarProducts products={similarProducts} />
      </div>
    </>
  );
}
