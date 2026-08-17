"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { useOrders } from "@/lib/orders/OrderContext";
import OrderCard from "@/components/orders/OrderCard";
import OrderStatusTabs, { type OrderTabKey } from "@/components/orders/OrderStatusTabs";

export default function PesananPage() {
  const { orders } = useOrders();
  const [activeTab, setActiveTab] = useState<OrderTabKey>("semua");

  const sorted = useMemo(
    () => [...orders].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)),
    [orders],
  );

  const counts = useMemo(() => {
    const result: Record<OrderTabKey, number> = {
      semua: sorted.length,
      diproses: 0,
      dikirim: 0,
      selesai: 0,
      dibatalkan: 0,
    };
    sorted.forEach((order) => {
      result[order.status] += 1;
    });
    return result;
  }, [sorted]);

  const filtered = activeTab === "semua" ? sorted : sorted.filter((order) => order.status === activeTab);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Pesanan Saya</h1>
      <p className="mt-1 text-sm text-ink-soft">Riwayat dan status pesanan Anda.</p>

      <div className="mt-6">
        <OrderStatusTabs active={activeTab} onChange={setActiveTab} counts={counts} />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-card px-6 py-16 text-center">
          <ClipboardList size={32} className="text-ink-soft/50" aria-hidden="true" />
          <p className="text-sm font-medium text-ink">
            Belum ada pesanan{activeTab !== "semua" ? " dengan status ini" : ""}
          </p>
          <Link
            href="/kategori"
            className="mt-2 rounded-xl bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand-dark"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
