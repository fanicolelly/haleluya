import { STATUS_META } from "@/lib/orders/statusMeta";
import type { OrderStatus } from "@/lib/orders/types";

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[10.5px] ${meta.badge}`}
    >
      <Icon size={11} aria-hidden="true" /> {meta.label}
    </span>
  );
}
