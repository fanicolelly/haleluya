export interface DailySales {
  date: string; // ISO date
  product: string;
  units: number;
  revenue: number;
}

export type Trend = "naik" | "turun" | "stagnan";

export interface ProductSummary {
  product: string;
  totalUnits: number;
  totalRevenue: number;
  avgDailyUnits: number;
  trend: Trend;
  trendPercent: number; // perubahan rata-rata paruh kedua vs paruh pertama periode
}

export interface AnomalyEvent {
  date: string;
  product: string;
  type: "lonjakan" | "penurunan";
  units: number;
  avgUnits: number;
  deviationPercent: number;
}

export interface DailyTotal {
  date: string;
  revenue: number;
  units: number;
}

export interface DashboardStats {
  periodStart: string;
  periodEnd: string;
  totalRevenue: number;
  totalUnits: number;
  bestSeller: ProductSummary;
  worstPerformer: ProductSummary;
  productSummaries: ProductSummary[];
  anomalies: AnomalyEvent[];
  dailyTotals: DailyTotal[];
}

// Ringkasan tanpa dailyTotals — inilah yang dikirim ke /api/sme-insight,
// BUKAN data mentah 60 hari x N produk (sesuai instruksi: kirim ringkasan
// angka agregat, bukan raw data).
export type InsightSummary = Omit<DashboardStats, "dailyTotals">;
