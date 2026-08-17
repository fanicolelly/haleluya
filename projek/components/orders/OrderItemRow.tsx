import Link from "next/link";
import type { OrderItem } from "@/lib/orders/types";
import ProductImagePlaceholder from "@/components/products/ProductImagePlaceholder";

function rupiah(amount: number): string {
  return "Rp" + amount.toLocaleString("id-ID");
}

export default function OrderItemRow({ item }: { item: OrderItem }) {
  return (
    <div className="flex gap-4 border-b border-line py-4 last:border-b-0">
      <Link href={`/produk/${item.productId}`} className="shrink-0">
        <ProductImagePlaceholder
          category={item.category}
          variantIndex={0}
          className="h-16 w-16 rounded-xl"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/produk/${item.productId}`}
          className="line-clamp-2 text-sm font-medium text-ink hover:text-brand"
        >
          {item.name}
        </Link>
        <p className="mt-1 font-mono text-xs text-ink-soft">
          {item.quantity}x {rupiah(item.price)}
        </p>
      </div>

      <p className="shrink-0 font-mono text-sm font-semibold text-ink">
        {rupiah(item.price * item.quantity)}
      </p>
    </div>
  );
}
