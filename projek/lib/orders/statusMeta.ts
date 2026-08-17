import { Clock, Truck, CheckCircle2, XCircle, type LucideIcon } from "lucide-react";
import type { OrderStatus } from "./types";

export const STATUS_META: Record<OrderStatus, { label: string; badge: string; icon: LucideIcon }> = {
  diproses: {
    label: "Diproses",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    icon: Clock,
  },
  dikirim: {
    label: "Dikirim",
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    icon: Truck,
  },
  selesai: {
    label: "Selesai",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  dibatalkan: {
    label: "Dibatalkan",
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    icon: XCircle,
  },
};
