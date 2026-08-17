"use client";

import Link from "next/link";
import { ShoppingCart, Star, X } from "lucide-react";
import type { Product } from "@/lib/products/types";
import ProductImagePlaceholder from "@/components/products/ProductImagePlaceholder";
import { useShop } from "@/lib/shop/ShopContext";

function rupiah(amount: number): string {
  return "Rp" + amount.toLocaleString("id-ID");
}

export default function WishlistItemCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist } = useShop();

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-card">
      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        aria-label={`Hapus ${product.name} dari wishlist`}
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink-soft shadow-sm transition-colors hover:text-rose-500"
      >
        <X size={13} />
      </button>

      <Link href={`/produk/${product.id}`} className="block">
        <ProductImagePlaceholder
          category={product.category}
          variantIndex={0}
          className="aspect-square w-full"
        />
        <div className="p-3">
          <p className="line-clamp-2 text-xs font-medium text-ink">{product.name}</p>
          <p className="mt-1 font-mono text-sm font-semibold text-ink">{rupiah(product.price)}</p>
          <p className="mt-0.5 flex items-center gap-1 font-mono text-[10.5px] text-ink-soft">
            <Star size={10} className="fill-amber-400 text-amber-400" aria-hidden="true" />
            {product.rating}
          </p>
        </div>
      </Link>

      <div className="p-3 pt-0">
        <button
          type="button"
          onClick={() => addToCart(product.id, 1)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-brand-dark"
        >
          <ShoppingCart size={13} /> Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
}
