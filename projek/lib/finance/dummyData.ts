import type { Transaction } from "./types";

// "Hari ini" untuk demo — sengaja pertengahan bulan Agustus 2026 supaya
// terlihat perbandingan aktual-vs-proyeksi sebelum bulan berakhir.
export const DEMO_TODAY = "2026-08-18";
export const DEFAULT_BUDGET = 3_000_000;

// 21 transaksi dummy sebulan (1-18 Agustus 2026): sengaja dirancang belanja
// hemat di minggu-minggu awal lalu meningkat di pertengahan bulan, supaya
// terlihat kenapa exponential smoothing (bobot lebih besar ke hari-hari
// terakhir) memberi proyeksi yang lebih waspada dibanding rata-rata linear.
export const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: "t01", date: "2026-08-01", category: "Makanan & Minuman", amount: 45000 },
  { id: "t02", date: "2026-08-02", category: "Transportasi", amount: 35000 },
  { id: "t03", date: "2026-08-03", category: "Makanan & Minuman", amount: 52000 },
  { id: "t04", date: "2026-08-04", category: "Makanan & Minuman", amount: 48000 },
  { id: "t05", date: "2026-08-05", category: "Transportasi", amount: 40000 },
  { id: "t06", date: "2026-08-06", category: "Makanan & Minuman", amount: 55000 },
  { id: "t07", date: "2026-08-07", category: "Hiburan", amount: 75000 },
  { id: "t08", date: "2026-08-08", category: "Makanan & Minuman", amount: 62000 },
  { id: "t09", date: "2026-08-09", category: "Transportasi", amount: 38000 },
  { id: "t10", date: "2026-08-09", category: "Tagihan", amount: 220000 },
  { id: "t11", date: "2026-08-10", category: "Belanja Online", amount: 189000 },
  { id: "t12", date: "2026-08-11", category: "Makanan & Minuman", amount: 85000 },
  { id: "t13", date: "2026-08-11", category: "Hiburan", amount: 95000 },
  { id: "t14", date: "2026-08-12", category: "Transportasi", amount: 45000 },
  { id: "t15", date: "2026-08-13", category: "Makanan & Minuman", amount: 78000 },
  { id: "t16", date: "2026-08-14", category: "Belanja Online", amount: 275000 },
  { id: "t17", date: "2026-08-15", category: "Hiburan", amount: 150000 },
  { id: "t18", date: "2026-08-15", category: "Makanan & Minuman", amount: 68000 },
  { id: "t19", date: "2026-08-16", category: "Makanan & Minuman", amount: 92000 },
  { id: "t20", date: "2026-08-17", category: "Belanja Online", amount: 399000 },
  { id: "t21", date: "2026-08-18", category: "Makanan & Minuman", amount: 88000 },
];
