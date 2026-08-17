import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import type { AnomalyEvent } from "@/lib/sme/types";
import { formatShortDate } from "@/lib/sme/format";

export default function AnomalyList({ anomalies }: { anomalies: AnomalyEvent[] }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <h3 className="text-sm font-semibold text-ink">Anomali Terdeteksi</h3>
      <p className="mt-1 text-xs leading-relaxed text-ink-soft">
        Hari dengan penjualan menyimpang &ge;2 simpangan baku dari rata-rata produk itu
        sendiri selama periode.
      </p>

      {anomalies.length === 0 ? (
        <p className="mt-4 text-xs text-ink-soft">Tidak ada anomali signifikan terdeteksi.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {anomalies.map((anomaly, index) => {
            const isSpike = anomaly.type === "lonjakan";
            const Icon = isSpike ? ArrowUpCircle : ArrowDownCircle;

            return (
              <li key={`${anomaly.product}-${anomaly.date}-${index}`} className="flex gap-2.5">
                <Icon
                  size={18}
                  className={`mt-0.5 shrink-0 ${isSpike ? "text-emerald-500" : "text-rose-500"}`}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-semibold text-ink">
                    {anomaly.product} · {formatShortDate(anomaly.date)}
                  </p>
                  <p className="text-xs leading-relaxed text-ink-soft">
                    {isSpike ? "Lonjakan" : "Penurunan"} ke {anomaly.units} unit (biasanya rata-rata{" "}
                    {anomaly.avgUnits.toFixed(1)} unit/hari, deviasi {anomaly.deviationPercent >= 0 ? "+" : ""}
                    {anomaly.deviationPercent.toFixed(0)}%)
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
