"use client";

import { ShoppingCart } from "lucide-react";
import { useShop } from "@/lib/shop/ShopContext";
import type { OrderItem } from "@/lib/orders/types";

export default function BuyAgainButton({ items }: { items: OrderItem[] }) {
  const { addToCart } = useShop();

  function handleClick() {
    items.forEach((item) => addToCart(item.productId, item.quantity));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
    >
      <ShoppingCart size={15} /> Beli Lagi
    </button>
  );
}
