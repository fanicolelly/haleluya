"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useShop } from "@/lib/shop/ShopContext";
import { getProductById } from "@/lib/products/catalog";
import type { Product } from "@/lib/products/types";
import WishlistItemCard from "@/components/wishlist/WishlistItemCard";

export default function WishlistPage() {
  const { wishlist, addToCart, toggleWishlist } = useShop();

  const products = wishlist
    .map((productId) => getProductById(productId))
    .filter((product): product is Product => !!product);

  function handleMoveAllToCart() {
    products.forEach((product) => {
      addToCart(product.id, 1);
      toggleWishlist(product.id);
    });
  }

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <Heart size={40} className="mx-auto text-ink-soft/50" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-bold text-ink">Wishlist Anda kosong</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Simpan produk favorit Anda di sini supaya mudah ditemukan lagi nanti.
        </p>
        <Link
          href="/kategori"
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Wishlist Saya</h1>
          <p className="mt-1 text-sm text-ink-soft">{products.length} produk tersimpan.</p>
        </div>
        <button
          type="button"
          onClick={handleMoveAllToCart}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          <ShoppingCart size={15} /> Pindahkan Semua ke Keranjang
        </button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <WishlistItemCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
