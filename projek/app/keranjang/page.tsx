"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useShop } from "@/lib/shop/ShopContext";
import { getProductById } from "@/lib/products/catalog";
import type { Product } from "@/lib/products/types";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";

export default function KeranjangPage() {
  const { cart } = useShop();

  const items = cart
    .map((item) => {
      const product = getProductById(item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter((item): item is { product: Product; quantity: number } => item !== null);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <ShoppingCart size={40} className="mx-auto text-ink-soft/50" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-bold text-ink">Keranjang Anda kosong</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Belum ada produk di keranjang. Yuk mulai belanja dan temukan produk favoritmu.
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
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Keranjang Belanja</h1>
      <p className="mt-1 text-sm text-ink-soft">{items.length} produk di keranjang Anda.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-line bg-card px-5">
          {items.map((item) => (
            <CartItemRow key={item.product.id} product={item.product} quantity={item.quantity} />
          ))}
        </div>

        <CartSummary subtotal={subtotal} />
      </div>
    </div>
  );
}
