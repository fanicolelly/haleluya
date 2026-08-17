import Link from "next/link";
import type { Order } from "@/lib/orders/types";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";

function rupiah(amount: number): string {
  return "Rp" + amount.toLocaleString("id-ID");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function OrderCard({ order }: { order: Order }) {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      href={`/pesanan/${order.id}`}
      className="block rounded-2xl border border-line bg-card p-5 transition-colors hover:border-brand/40"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-ink-soft">{order.id}</p>
          <p className="mt-0.5 text-xs text-ink-soft">{formatDate(order.date)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <p className="mt-3 line-clamp-1 text-sm text-ink">
        {order.items.map((item) => item.name).join(", ")}
      </p>

      <div className="mt-3 flex items-center justify-between border-t border-dashed border-line pt-3">
        <p className="text-xs text-ink-soft">{totalItems} item</p>
        <p className="font-mono text-sm font-semibold text-ink">{rupiah(order.total)}</p>
      </div>
    </Link>
  );
}
