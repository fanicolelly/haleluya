import type { Transaction, ProjectionResult, DailyChartPoint, CategoryBreakdown } from "./types";

// ============================================================================
// PROYEKSI ANGGARAN: rule-based budget engine + exponential smoothing
// sederhana — BUKAN model time-series produksi (bukan ARIMA/Holt-Winters/dsb).
//
// Alur:
// 1. Kelompokkan transaksi jadi deret pengeluaran HARIAN (hari tanpa
//    transaksi dihitung 0, bukan diabaikan — penting supaya rata-rata tidak
//    bias ke atas oleh hari-hari yang kebetulan ada transaksi saja).
// 2. Simple exponential smoothing (SES) dengan alpha=0.3:
//    S_t = alpha * X_t + (1 - alpha) * S_(t-1), S_1 = X_1.
//    Alpha lebih tinggi = lebih reaktif terhadap perubahan terkini; 0.3
//    adalah nilai umum di buku teks (bukan hasil tuning/cross-validation
//    terhadap data pengguna sungguhan).
// 3. S_n (nilai smoothed di hari terakhir) dipakai sebagai estimasi laju
//    belanja "khas" SAAT INI, lalu dikalikan sisa hari untuk proyeksi akhir
//    bulan.
// 4. Dibandingkan dengan rata-rata sederhana (linear) supaya kelihatan
//    bedanya: rata-rata sederhana memperlakukan semua hari sama rata,
//    sementara smoothing memberi bobot lebih besar ke hari-hari terakhir —
//    jadi lebih cepat menangkap percepatan/perlambatan belanja terkini.
//
// Versi produksi akan memakai model time-series yang menangani tren &
// musiman (mis. Holt-Winters) atau model yang dilatih dari histori
// pengguna sungguhan, bukan alpha tetap seperti ini.
// ============================================================================

const ALPHA = 0.3;

function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function toISODate(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function exponentialSmoothing(series: number[], alpha: number): number {
  if (series.length === 0) return 0;
  let smoothed = series[0];
  for (let i = 1; i < series.length; i++) {
    smoothed = alpha * series[i] + (1 - alpha) * smoothed;
  }
  return smoothed;
}

function buildDailySeries(
  transactions: Transaction[],
  year: number,
  month: number,
  daysElapsed: number,
): number[] {
  const perDay = new Array(daysElapsed).fill(0) as number[];
  transactions.forEach((tx) => {
    const txDate = parseISODate(tx.date);
    if (txDate.getUTCFullYear() !== year || txDate.getUTCMonth() !== month - 1) return;
    const day = txDate.getUTCDate();
    if (day >= 1 && day <= daysElapsed) {
      perDay[day - 1] += tx.amount;
    }
  });
  return perDay;
}

export function computeProjection(
  transactions: Transaction[],
  budget: number,
  today: string,
): ProjectionResult {
  const todayDate = parseISODate(today);
  const year = todayDate.getUTCFullYear();
  const month = todayDate.getUTCMonth() + 1;
  const daysElapsed = todayDate.getUTCDate();
  const daysInMonth = getDaysInMonth(year, month);
  const daysRemaining = Math.max(0, daysInMonth - daysElapsed);

  const dailySeries = buildDailySeries(transactions, year, month, daysElapsed);
  const totalSpent = dailySeries.reduce((sum, value) => sum + value, 0);
  const remainingBudget = budget - totalSpent;
  const percentUsed = budget > 0 ? (totalSpent / budget) * 100 : 0;

  const simpleAvgPerDay = daysElapsed > 0 ? totalSpent / daysElapsed : 0;
  const simpleProjectedTotal = totalSpent + simpleAvgPerDay * daysRemaining;
  const simpleProjectedPercent = budget > 0 ? (simpleProjectedTotal / budget) * 100 : 0;

  const smoothedAvgPerDay = exponentialSmoothing(dailySeries, ALPHA);
  const smoothedProjectedTotal = totalSpent + smoothedAvgPerDay * daysRemaining;
  const smoothedProjectedPercent = budget > 0 ? (smoothedProjectedTotal / budget) * 100 : 0;

  const willExceedBudget = smoothedProjectedPercent >= 100;
  const earlyWarning = daysRemaining > 0 && smoothedProjectedPercent >= 90;

  let projectedExhaustDate: string | null = null;
  if (remainingBudget <= 0) {
    projectedExhaustDate = today;
  } else if (smoothedAvgPerDay > 0) {
    const daysUntilExhausted = Math.ceil(remainingBudget / smoothedAvgPerDay);
    if (daysUntilExhausted <= daysRemaining) {
      projectedExhaustDate = toISODate(year, month, daysElapsed + daysUntilExhausted);
    }
  }

  return {
    today,
    daysInMonth,
    daysElapsed,
    daysRemaining,
    totalSpent,
    remainingBudget,
    percentUsed,
    simpleAvgPerDay,
    simpleProjectedTotal,
    simpleProjectedPercent,
    smoothedAvgPerDay,
    smoothedProjectedTotal,
    smoothedProjectedPercent,
    willExceedBudget,
    earlyWarning,
    projectedExhaustDate,
  };
}

export function buildDailyChartData(
  transactions: Transaction[],
  budget: number,
  today: string,
  projection: ProjectionResult,
): DailyChartPoint[] {
  const todayDate = parseISODate(today);
  const year = todayDate.getUTCFullYear();
  const month = todayDate.getUTCMonth() + 1;
  const { daysInMonth, daysElapsed, totalSpent, smoothedAvgPerDay } = projection;

  const dailySeries = buildDailySeries(transactions, year, month, daysElapsed);
  const pacePerDay = budget / daysInMonth;

  let runningActual = 0;
  const points: DailyChartPoint[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const isPast = day <= daysElapsed;
    if (isPast) runningActual += dailySeries[day - 1] ?? 0;

    let projected: number | null = null;
    if (day === daysElapsed) {
      projected = runningActual; // titik sambung dengan garis aktual
    } else if (day > daysElapsed) {
      projected = totalSpent + smoothedAvgPerDay * (day - daysElapsed);
    }

    points.push({
      day,
      date: toISODate(year, month, day),
      actual: isPast ? runningActual : null,
      projected,
      pace: pacePerDay * day,
    });
  }

  return points;
}

export function buildCategoryBreakdown(transactions: Transaction[]): CategoryBreakdown[] {
  const totals = new Map<string, number>();
  transactions.forEach((tx) => {
    totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amount);
  });

  const grandTotal = Array.from(totals.values()).reduce((sum, value) => sum + value, 0);

  return Array.from(totals.entries())
    .map(([category, total]) => ({
      category,
      total,
      percent: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}
