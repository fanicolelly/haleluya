import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { ProductSummary, Trend } from "@/lib/sme/types";
import { rupiah } from "@/lib/sme/format";

const TREND_META: Record<Trend, { label: string; classes: string; icon: typeof TrendingUp }> = {
  naik: { label: "Naik", classes: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: TrendingUp },
  turun: { label: "Turun", classes: "bg-rose-50 text-rose-700 border-rose-200", icon: TrendingDown },
  stagnan: { label: "Stagnan", classes: "bg-slate-100 text-slate-600 border-slate-200", icon: Minus },
};

export default function ProductCards({ products }: { products: ProductSummary[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => {
        const meta = TREND_META[product.trend];
        const Icon = meta.icon;

        return (
          <div key={product.product} className="rounded-xl border border-line bg-card p-4">
            <p className="line-clamp-2 text-sm font-semibold leading-snug text-ink">
              {product.product}
            </p>
            <p className="mt-2 font-mono text-lg font-semibold text-ink">
              {rupiah(product.totalRevenue)}
            </p>
            <p className="text-xs text-ink-soft">{product.totalUnits} unit terjual</p>

            <span
              className={`mt-2.5 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[10.5px] ${meta.classes}`}
            >
              <Icon size={12} /> {meta.label} ({product.trendPercent >= 0 ? "+" : ""}
              {product.trendPercent.toFixed(0)}%)
            </span>
          </div>
        );
      })}
    </div>
  );
}
