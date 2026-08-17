import Link from "next/link";

function rupiah(amount: number): string {
  return "Rp" + amount.toLocaleString("id-ID");
}

// Ongkir dummy tetap untuk demo — belum ada integrasi kurir/alamat sungguhan.
const SHIPPING_FEE = 15000;

export default function CartSummary({ subtotal }: { subtotal: number }) {
  const total = subtotal + SHIPPING_FEE;

  return (
    <div className="rounded-2xl border border-line bg-card p-5 lg:sticky lg:top-20">
      <h2 className="text-sm font-semibold text-ink">Ringkasan Belanja</h2>

      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-ink-soft">Subtotal</dt>
          <dd className="font-mono text-ink">{rupiah(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-ink-soft">Estimasi Ongkir</dt>
          <dd className="font-mono text-ink">{rupiah(SHIPPING_FEE)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-dashed border-line pt-2.5 font-semibold">
          <dt className="text-ink">Total</dt>
          <dd className="font-mono text-ink">{rupiah(total)}</dd>
        </div>
      </dl>

      <Link
        href="/checkout"
        className="mt-5 flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
      >
        Lanjut ke Pembayaran
      </Link>
    </div>
  );
}
