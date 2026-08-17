import type { InsightSummary } from "./types";
import { rupiah } from "./format";

// Mengubah ringkasan angka jadi teks yang mudah dibaca (bukan JSON mentah)
// supaya jelas persis data apa yang dilihat model — sekaligus jadi
// "kontrak" data yang sama dipakai baik oleh Claude (lewat /api/sme-insight)
// maupun generateTemplateInsight() sebagai fallback.
export function formatSummaryForPrompt(summary: InsightSummary): string {
  const lines: string[] = [];

  lines.push(`Periode: ${summary.periodStart} s.d. ${summary.periodEnd}`);
  lines.push(`Total omzet: ${rupiah(summary.totalRevenue)}`);
  lines.push(`Total unit terjual: ${summary.totalUnits}`);
  lines.push("");
  lines.push("Ringkasan per produk:");
  summary.productSummaries.forEach((product) => {
    lines.push(
      `- ${product.product}: ${product.totalUnits} unit, omzet ${rupiah(product.totalRevenue)}, rata-rata ${product.avgDailyUnits.toFixed(1)} unit/hari, tren ${product.trend} (${product.trendPercent.toFixed(1)}%)`,
    );
  });
  lines.push("");
  lines.push(`Produk terlaris (omzet tertinggi): ${summary.bestSeller.product}`);
  lines.push(
    `Produk dengan performa paling menurun: ${summary.worstPerformer.product} (${summary.worstPerformer.trendPercent.toFixed(1)}%)`,
  );

  if (summary.anomalies.length > 0) {
    lines.push("");
    lines.push("Anomali terdeteksi:");
    summary.anomalies.forEach((anomaly) => {
      lines.push(
        `- ${anomaly.product} pada ${anomaly.date}: ${anomaly.type} (${anomaly.units} unit, rata-rata biasanya ${anomaly.avgUnits.toFixed(1)} unit, deviasi ${anomaly.deviationPercent.toFixed(0)}%)`,
      );
    });
  }

  return lines.join("\n");
}
