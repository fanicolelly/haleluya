export interface Transaction {
  id: string;
  date: string; // ISO date, "2026-08-05"
  category: string;
  amount: number;
}

export interface ProjectionResult {
  today: string;
  daysInMonth: number;
  daysElapsed: number;
  daysRemaining: number;
  totalSpent: number;
  remainingBudget: number;
  percentUsed: number; // totalSpent / budget * 100
  simpleAvgPerDay: number;
  simpleProjectedTotal: number;
  simpleProjectedPercent: number;
  smoothedAvgPerDay: number;
  smoothedProjectedTotal: number;
  smoothedProjectedPercent: number;
  willExceedBudget: boolean; // proyeksi smoothed >= 100% anggaran
  earlyWarning: boolean; // proyeksi smoothed >= 90% anggaran, dan bulan belum berakhir
  projectedExhaustDate: string | null; // estimasi tanggal anggaran habis di laju smoothed, kalau ada
}

export interface DailyChartPoint {
  day: number;
  date: string;
  actual: number | null; // kumulatif aktual s.d. hari ini (null untuk hari yang belum terjadi)
  projected: number | null; // kumulatif proyeksi smoothed (null untuk hari yang sudah lewat, kecuali hari ini sebagai titik sambung)
  pace: number; // kumulatif "kalau belanja rata sepanjang bulan" — garis referensi
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  percent: number; // persentase dari total pengeluaran (bukan dari anggaran)
}
