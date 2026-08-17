"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { Product } from "@/lib/products/types";
import ProductImagePlaceholder from "@/components/products/ProductImagePlaceholder";
import { useShop } from "@/lib/shop/ShopContext";

function rupiah(amount: number): string {
  return "Rp" + amount.toLocaleString("id-ID");
}

export default function CartItemRow({
  product,
  quantity,
}: {
  product: Product;
  quantity: number;
}) {
  const { updateCartQuantity, removeFromCart } = useShop();

  return (
    <div className="flex gap-4 border-b border-line py-4 last:border-b-0">
      <Link href={`/produk/${product.id}`} className="shrink-0">
        <ProductImagePlaceholder
          category={product.category}
          variantIndex={0}
          className="h-20 w-20 rounded-xl"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/produk/${product.id}`}
          className="line-clamp-2 text-sm font-medium text-ink hover:text-brand"
        >
          {product.name}
        </Link>
        <p className="mt-1 font-mono text-xs text-ink-soft">{rupiah(product.price)} / item</p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center rounded-lg border border-line">
            <button
              type="button"
              onClick={() => updateCartQuantity(product.id, quantity - 1)}
              aria-label={`Kurangi jumlah ${product.name}`}
              className="flex h-8 w-8 items-center justify-center text-ink-soft hover:text-ink"
            >
              <Minus size={13} />
            </button>
            <span className="w-7 text-center font-mono text-xs text-ink">{quantity}</span>
            <button
              type="button"
              onClick={() => updateCartQuantity(product.id, quantity + 1)}
              aria-label={`Tambah jumlah ${product.name}`}
              className="flex h-8 w-8 items-center justify-center text-ink-soft hover:text-ink"
            >
              <Plus size={13} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeFromCart(product.id)}
            aria-label={`Hapus ${product.name} dari keranjang`}
            className="text-ink-soft hover:text-rose-600"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="font-mono text-sm font-semibold text-ink">{rupiah(product.price * quantity)}</p>
      </div>
    </div>
  );
}
