import type { DailySales, ProductSummary, AnomalyEvent, DashboardStats, Trend } from "./types";

// ============================================================================
// ANALITIK DESKRIPTIF + DETEKSI ANOMALI SEDERHANA — bukan model ML/forecasting
// sungguhan (proposal menyebut forecasting permintaan; versi produksi akan
// memakai model time-series seperti di lib/finance/projection.ts, atau lebih
// canggih lagi). Di sini murni statistik deskriptif dasar:
// - Tren per produk: bandingkan rata-rata unit/hari paruh kedua vs paruh
//   pertama periode. Naik jika naik >=15%, turun jika turun >=15%, selebihnya
//   stagnan.
// - Anomali: z-score sederhana per produk (unit hari itu dibanding rata-rata
//   & simpangan baku produk itu sendiri selama periode). |z| >= 2 dianggap
//   anomali — ambang umum di statistik deskriptif, bukan hasil tuning.
// ============================================================================

const TREND_THRESHOLD_PERCENT = 15;
const ANOMALY_Z_THRESHOLD = 2;

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function average(values: number[]): number {
  return values.length > 0 ? sum(values) / values.length : 0;
}

export function computeProductSummary(product: string, rows: DailySales[]): ProductSummary {
  const units = rows.map((row) => row.units);
  const totalUnits = sum(units);
  const totalRevenue = sum(rows.map((row) => row.revenue));
  const avgDailyUnits = average(units);

  const half = Math.floor(rows.length / 2);
  const firstHalfAvg = average(units.slice(0, half));
  const secondHalfAvg = average(units.slice(half));
  const trendPercent = firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 : 0;

  let trend: Trend = "stagnan";
  if (trendPercent >= TREND_THRESHOLD_PERCENT) trend = "naik";
  else if (trendPercent <= -TREND_THRESHOLD_PERCENT) trend = "turun";

  return { product, totalUnits, totalRevenue, avgDailyUnits, trend, trendPercent };
}

export function detectAnomalies(product: string, rows: DailySales[]): AnomalyEvent[] {
  const units = rows.map((row) => row.units);
  const mean = average(units);
  const stdDev = Math.sqrt(average(units.map((value) => (value - mean) ** 2)));
  if (stdDev === 0) return [];

  const anomalies: AnomalyEvent[] = [];
  rows.forEach((row) => {
    const deviation = row.units - mean;
    const zScore = deviation / stdDev;
    if (Math.abs(zScore) >= ANOMALY_Z_THRESHOLD) {
      anomalies.push({
        date: row.date,
        product,
        type: deviation > 0 ? "lonjakan" : "penurunan",
        units: row.units,
        avgUnits: mean,
        deviationPercent: mean > 0 ? (deviation / mean) * 100 : 0,
      });
    }
  });
  return anomalies;
}

export function buildDashboardStats(rows: DailySales[]): DashboardStats {
  const products = Array.from(new Set(rows.map((row) => row.product)));
  const rowsByProduct = new Map(products.map((product) => [product, rows.filter((row) => row.product === product)]));

  const productSummaries = products.map((product) => computeProductSummary(product, rowsByProduct.get(product)!));

  const bestSeller = [...productSummaries].sort((a, b) => b.totalRevenue - a.totalRevenue)[0];
  const worstPerformer = [...productSummaries].sort((a, b) => a.trendPercent - b.trendPercent)[0];

  const anomalies = products
    .flatMap((product) => detectAnomalies(product, rowsByProduct.get(product)!))
    .sort((a, b) => Math.abs(b.deviationPercent) - Math.abs(a.deviationPercent))
    .slice(0, 5);

  const dates = Array.from(new Set(rows.map((row) => row.date))).sort();
  const dailyTotals = dates.map((date) => {
    const dayRows = rows.filter((row) => row.date === date);
    return {
      date,
      revenue: sum(dayRows.map((row) => row.revenue)),
      units: sum(dayRows.map((row) => row.units)),
    };
  });

  return {
    periodStart: dates[0],
    periodEnd: dates[dates.length - 1],
    totalRevenue: sum(rows.map((row) => row.revenue)),
    totalUnits: sum(rows.map((row) => row.units)),
    bestSeller,
    worstPerformer,
    productSummaries,
    anomalies,
    dailyTotals,
  };
}
