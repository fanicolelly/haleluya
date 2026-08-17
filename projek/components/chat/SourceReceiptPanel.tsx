import { Package } from "lucide-react";
import type { RetrievedProduct } from "@/lib/chat/types";

function rupiah(amount: number): string {
  return "Rp" + amount.toLocaleString("id-ID");
}

// Panel "struk sumber data" — dipertahankan dari prototipe HTML sebagai
// bukti visual grounded generation (produk yang benar-benar dipakai model
// untuk menjawab, bukan dikarang). Reusable: hanya butuh array
// RetrievedProduct dari lib/chat/types.ts.
export default function SourceReceiptPanel({ products }: { products: RetrievedProduct[] }) {
  return (
    <section
      aria-labelledby="receipt-panel-heading"
      className="flex flex-col overflow-hidden rounded-2xl border border-line bg-card"
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <h3 id="receipt-panel-heading" className="text-sm font-semibold text-ink">
          Struk Sumber Data (Grounding)
        </h3>
        <span className="font-mono text-xs text-ink-soft">{products.length} produk</span>
      </div>

      <div className="min-h-[360px] max-h-[520px] flex-1 overflow-y-auto p-4">
        {products.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
            <Package size={28} className="text-ink-soft/40" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-ink-soft">
              Panel ini menunjukkan produk hasil retrieval yang benar-benar dipakai model
              untuk menjawab — bukti bahwa jawaban tidak dikarang (grounded generation).
              Kirim pesan untuk mulai.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-lg border border-line bg-card shadow-sm"
              >
                <div className="receipt-tear" aria-hidden="true" />
                <div className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-snug text-ink">{product.name}</p>
                    <span className="shrink-0 rounded bg-emerald-500 px-1.5 py-0.5 font-mono text-[9.5px] tracking-wide text-white">
                      GROUNDED
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-[10.5px] text-ink-soft">
                    {product.category} · ★ {product.rating}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{product.desc}</p>
                  <div className="my-2.5 border-t border-dashed border-line" />
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-ink-soft">
                      skor kemiripan: {Math.round(product.score * 100)}%
                    </span>
                    <span className="font-semibold text-brand-dark">{rupiah(product.price)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
