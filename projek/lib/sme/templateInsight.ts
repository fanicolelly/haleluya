import type { InsightSummary } from "./types";
import { rupiah, formatShortDate } from "./format";

// FALLBACK GENERATION (tanpa API key) — bukan LLM sungguhan, sama seperti
// lib/chat/templateReply.ts. Narasi disusun dari template teks yang mengisi
// langsung angka dari InsightSummary (field yang sama yang dikirim ke
// Claude lewat formatSummaryForPrompt), jadi tidak mengarang data — hanya
// menyusun kalimat, bukan generative language model.
export function generateTemplateInsight(summary: InsightSummary): string {
  const parts: string[] = [];

  parts.push(
    `Selama periode ${formatShortDate(summary.periodStart)}–${formatShortDate(summary.periodEnd)}, total omzet mencapai ${rupiah(summary.totalRevenue)} dari ${summary.totalUnits} unit terjual di ${summary.productSummaries.length} produk.`,
  );

  parts.push(
    `${summary.bestSeller.product} adalah produk terlaris dengan omzet ${rupiah(summary.bestSeller.totalRevenue)}${
      summary.bestSeller.trend === "naik" ? ` dan tren naik (+${summary.bestSeller.trendPercent.toFixed(0)}%)` : ""
    } — pertimbangkan menambah stok agar tidak kehabisan.`,
  );

  if (summary.worstPerformer.trend === "turun") {
    parts.push(
      `Sebaliknya, ${summary.worstPerformer.product} menurun ${Math.abs(summary.worstPerformer.trendPercent).toFixed(0)}% dibanding paruh pertama periode — coba buat promo diskon atau bundling untuk mendorong penjualannya kembali.`,
    );
  }

  const topAnomaly = summary.anomalies[0];
  if (topAnomaly) {
    if (topAnomaly.type === "lonjakan") {
      parts.push(
        `Ada lonjakan permintaan pada ${topAnomaly.product} tanggal ${formatShortDate(topAnomaly.date)} (${topAnomaly.units} unit, jauh di atas rata-rata ${topAnomaly.avgUnits.toFixed(1)} unit/hari) — siapkan stok ekstra untuk mengantisipasi pola serupa, misalnya saat promo atau akhir pekan.`,
      );
    } else {
      parts.push(
        `Ada penurunan tajam pada ${topAnomaly.product} tanggal ${formatShortDate(topAnomaly.date)} (hanya ${topAnomaly.units} unit) — cek kemungkinan stok habis atau kendala pengiriman di tanggal tersebut.`,
      );
    }
  }

  parts.push(
    "Rekomendasi: (1) tambah stok untuk produk bertren naik, (2) buat promo/diskon untuk produk yang menurun, (3) siapkan stok cadangan menjelang pola lonjakan permintaan yang berulang.",
  );

  return parts.join(" ");
}
