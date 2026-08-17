"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/lib/products/types";
import ProductImagePlaceholder from "@/components/products/ProductImagePlaceholder";
import { useShop } from "@/lib/shop/ShopContext";

function rupiah(amount: number): string {
  return "Rp" + amount.toLocaleString("id-ID");
}

export default function ProductCard({ product }: { product: Product }) {
  const { isInWishlist, toggleWishlist, addToCart } = useShop();
  const wished = isInWishlist(product.id);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-card transition-colors hover:border-brand/40">
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

      <div className="absolute right-2 top-2 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            toggleWishlist(product.id);
          }}
          aria-pressed={wished}
          aria-label={wished ? `Hapus ${product.name} dari wishlist` : `Tambah ${product.name} ke wishlist`}
          className={`flex h-7 w-7 items-center justify-center rounded-full shadow-sm transition-colors ${
            wished ? "bg-rose-50 text-rose-500" : "bg-white/90 text-ink-soft hover:text-rose-500"
          }`}
        >
          <Heart size={13} className={wished ? "fill-rose-500" : ""} />
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            addToCart(product.id, 1);
          }}
          aria-label={`Tambah ${product.name} ke keranjang`}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink-soft shadow-sm transition-colors hover:text-brand"
        >
          <ShoppingCart size={13} />
        </button>
      </div>
    </div>
  );
}
