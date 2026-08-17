"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin } from "lucide-react";
import { useOrders } from "@/lib/orders/OrderContext";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import OrderTimeline from "@/components/orders/OrderTimeline";
import OrderItemRow from "@/components/orders/OrderItemRow";
import CancelOrderButton from "@/components/orders/CancelOrderButton";
import BuyAgainButton from "@/components/orders/BuyAgainButton";
import ReviewModalButton from "@/components/orders/ReviewModalButton";

function rupiah(amount: number): string {
  return "Rp" + amount.toLocaleString("id-ID");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

// Data pesanan hidup di client (Context + localStorage), bukan di server,
// jadi halaman ini murni client component — pakai useParams() alih-alih
// prop params server, dan "tidak ditemukan" ditangani sebagai render
// kondisional biasa (bukan notFound()/not-found.tsx yang hanya berlaku
// untuk Server Component).
export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { getOrderById } = useOrders();
  const order = getOrderById(params.id);

  if (!order) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <p className="font-mono text-xs text-ink-soft">404</p>
        <h1 className="mt-2 text-2xl font-bold text-ink">Pesanan tidak ditemukan</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Pesanan yang Anda cari tidak tersedia atau tautannya salah.
        </p>
        <Link href="/pesanan" className="mt-6 inline-flex items-center gap-1.5 font-medium text-brand">
          ← Kembali ke pesanan
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/pesanan"
        className="inline-flex items-center gap-1 text-xs font-medium text-ink-soft hover:text-brand"
      >
        <ChevronLeft size={14} /> Kembali ke pesanan
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-sm text-ink">{order.id}</p>
          <p className="mt-1 text-xs text-ink-soft">{formatDate(order.date)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-card p-5">
        <OrderTimeline status={order.status} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="rounded-2xl border border-line bg-card px-5">
            {order.items.map((item) => (
              <OrderItemRow key={item.productId} item={item} />
            ))}
          </div>

          {(order.status === "diproses" || order.status === "selesai") && (
            <div className="mt-4 flex flex-wrap gap-3">
              {order.status === "diproses" && <CancelOrderButton orderId={order.id} />}
              {order.status === "selesai" && (
                <>
                  <BuyAgainButton items={order.items} />
                  <ReviewModalButton />
                </>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-card p-5">
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-ink-soft" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-ink">Alamat Pengiriman</h2>
            </div>
            <div className="mt-3 text-xs leading-relaxed text-ink-soft">
              <p className="font-medium text-ink">{order.shippingAddress.recipientName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p className="mt-1">{order.shippingAddress.addressLine}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-card p-5">
            <h2 className="text-sm font-semibold text-ink">Ringkasan Pembayaran</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="font-mono text-ink">{rupiah(order.subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ink-soft">Ongkir</dt>
                <dd className="font-mono text-ink">{rupiah(order.shippingFee)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-line pt-2 font-semibold">
                <dt className="text-ink">Total</dt>
                <dd className="font-mono text-ink">{rupiah(order.total)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
