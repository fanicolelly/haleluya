"use client";

import { useState } from "react";
import { Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/lib/products/types";
import { useShop } from "@/lib/shop/ShopContext";

function rupiah(amount: number): string {
  return "Rp" + amount.toLocaleString("id-ID");
}

export default function ProductInfo({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart, isInWishlist, toggleWishlist } = useShop();
  const wished = isInWishlist(product.id);

  function handleAddToCart() {
    addToCart(product.id, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  }

  const stockLabel =
    product.stock > 10
      ? "Stok tersedia"
      : product.stock > 0
        ? `Stok terbatas (${product.stock})`
        : "Stok habis";

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-wide text-ink-soft">{product.category}</p>
      <h1 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">{product.name}</h1>

      <div className="mt-2 flex items-center gap-2">
        <div className="flex items-center gap-1 text-amber-500">
          <Star size={15} className="fill-amber-400" aria-hidden="true" />
          <span className="font-mono text-sm text-ink">{product.rating}</span>
        </div>
        <span className={`text-xs ${product.stock === 0 ? "text-rose-600" : "text-ink-soft"}`}>
          · {stockLabel}
        </span>
      </div>

      <p className="mt-4 font-mono text-2xl font-semibold text-ink">{rupiah(product.price)}</p>

      <p className="mt-4 text-sm leading-relaxed text-ink-soft">{product.longDescription}</p>

      <div className="mt-6 flex items-center gap-3">
        <span className="text-xs font-medium text-ink-soft">Jumlah</span>
        <div className="flex items-center rounded-xl border border-line">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            aria-label="Kurangi jumlah"
            className="flex h-9 w-9 items-center justify-center text-ink-soft hover:text-ink"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center font-mono text-sm text-ink">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(99, value + 1))}
            aria-label="Tambah jumlah"
            className="flex h-9 w-9 items-center justify-center text-ink-soft hover:text-ink"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          <ShoppingCart size={16} /> {justAdded ? "Ditambahkan!" : "Tambah ke Keranjang"}
        </button>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={wished}
          aria-label={wished ? "Hapus dari wishlist" : "Tambah ke wishlist"}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors ${
            wished
              ? "border-rose-200 bg-rose-50 text-rose-500"
              : "border-line text-ink-soft hover:border-rose-200 hover:text-rose-500"
          }`}
        >
          <Heart size={18} className={wished ? "fill-rose-500" : ""} />
        </button>
      </div>
    </div>
  );
}
