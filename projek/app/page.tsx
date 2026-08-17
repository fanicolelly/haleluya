import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { features } from "@/lib/features";
import { getProductById } from "@/lib/products/catalog";
import FeatureIconCard from "@/components/FeatureIconCard";
import ProductCard from "@/components/products/ProductCard";
import PromptComposer from "@/components/PromptComposer";
import BotMascot from "@/components/BotMascot";

// Produk pilihan untuk "Rekomendasi Untukmu" di beranda — diambil dari
// katalog asli (data/products.json) yang sama dengan /produk, bukan data
// dummy terpisah, supaya kartu produk bisa diklik ke halaman detail asli
// dan tombol wishlist/keranjang benar-benar berfungsi lewat ShopContext.
const FEATURED_PRODUCT_IDS = ["p01", "p06", "p17", "p07", "p02", "p05"];
const featuredProducts = FEATURED_PRODUCT_IDS.map(getProductById).filter(
  (product): product is NonNullable<typeof product> => product !== undefined,
);

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl">
      <section className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <div className="max-w-xl">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Selamat datang! 👋</h1>
          <p className="text-2xl font-bold text-ink sm:text-3xl">
            Ada yang bisa <span className="text-brand">BelanjAI</span> bantu hari ini?
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Temukan produk terbaik, bandingkan pilihan, dan kelola belanjamu dengan
            cerdas — semua dari satu ekosistem AI.
          </p>

          <div className="mt-6">
            <PromptComposer />
          </div>
        </div>

        <BotMascot />
      </section>

      <section id="fitur-ai" className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink">Fitur AI Unggulan</h2>
          <a
            href="#fitur-ai"
            className="inline-flex items-center gap-1 text-xs font-medium text-brand"
          >
            Lihat semua fitur <ChevronRight size={14} />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {features.map((feature) => (
            <FeatureIconCard key={feature.slug} feature={feature} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink">Rekomendasi Untukmu</h2>
          <Link
            href="/produk"
            className="inline-flex items-center gap-1 text-xs font-medium text-brand"
          >
            Lihat semua <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
