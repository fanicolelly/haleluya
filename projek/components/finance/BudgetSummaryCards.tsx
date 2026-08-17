import type { ProjectionResult } from "@/lib/finance/types";
import { rupiah } from "@/lib/finance/format";

export default function BudgetSummaryCards({ projection }: { projection: ProjectionResult }) {
  const remainingIsNegative = projection.remainingBudget < 0;

  const cards = [
    {
      label: "Terpakai",
      value: rupiah(projection.totalSpent),
      caption: `${projection.percentUsed.toFixed(1)}% dari anggaran`,
    },
    {
      label: "Sisa Anggaran",
      value: rupiah(projection.remainingBudget),
      caption: remainingIsNegative ? "sudah minus" : `hari ke-${projection.daysElapsed} dari ${projection.daysInMonth}`,
      warn: remainingIsNegative,
    },
    {
      label: "Proyeksi Akhir Bulan",
      value: rupiah(projection.smoothedProjectedTotal),
      caption: `${projection.smoothedProjectedPercent.toFixed(1)}% dari anggaran (smoothed)`,
      warn: projection.smoothedProjectedPercent >= 90,
    },
    {
      label: "Sisa Hari",
      value: String(projection.daysRemaining),
      caption: "hari tersisa bulan ini",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-line bg-card p-4">
          <p className="font-mono text-[10.5px] uppercase tracking-wider text-ink-soft">
            {card.label}
          </p>
          <p className={`mt-1.5 font-mono text-lg font-semibold ${card.warn ? "text-rose-600" : "text-ink"}`}>
            {card.value}
          </p>
          <p className="mt-0.5 text-xs text-ink-soft">{card.caption}</p>
        </div>
      ))}
    </div>
  );
}
