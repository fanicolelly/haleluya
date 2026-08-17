"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useOrders } from "@/lib/orders/OrderContext";

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const { cancelOrder } = useOrders();

  function handleConfirm() {
    cancelOrder(orderId);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
      >
        Batalkan Pesanan
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Batalkan pesanan?">
        <p className="text-sm leading-relaxed text-ink-soft">
          Pesanan yang dibatalkan tidak bisa diproses ulang. Apakah Anda yakin ingin membatalkan
          pesanan <span className="font-mono text-ink">{orderId}</span>?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl border border-line px-4 py-2 text-xs font-medium text-ink-soft hover:text-ink"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-medium text-white hover:bg-rose-700"
          >
            Ya, Batalkan Pesanan
          </button>
        </div>
      </Modal>
    </>
  );
}
