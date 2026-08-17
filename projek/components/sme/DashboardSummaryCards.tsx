import type { DashboardStats } from "@/lib/sme/types";
import { rupiah } from "@/lib/sme/format";

export default function DashboardSummaryCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      label: "Total Omzet",
      value: rupiah(stats.totalRevenue),
      caption: `periode ${stats.periodStart} s.d. ${stats.periodEnd}`,
    },
    {
      label: "Total Unit Terjual",
      value: `${stats.totalUnits.toLocaleString("id-ID")} unit`,
      caption: `${stats.productSummaries.length} produk`,
    },
    {
      label: "Produk Terlaris",
      value: stats.bestSeller.product,
      caption: `${rupiah(stats.bestSeller.totalRevenue)} · tren ${stats.bestSeller.trend}`,
    },
    {
      label: "Performa Menurun",
      value: stats.worstPerformer.product,
      caption: `${stats.worstPerformer.trendPercent.toFixed(0)}% vs paruh pertama`,
      warn: stats.worstPerformer.trend === "turun",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-line bg-card p-4">
          <p className="font-mono text-[10.5px] uppercase tracking-wider text-ink-soft">
            {card.label}
          </p>
          <p
            className={`mt-1.5 line-clamp-1 text-base font-semibold ${card.warn ? "text-rose-600" : "text-ink"}`}
          >
            {card.value}
          </p>
          <p className="mt-0.5 text-xs text-ink-soft">{card.caption}</p>
        </div>
      ))}
    </div>
  );
}
