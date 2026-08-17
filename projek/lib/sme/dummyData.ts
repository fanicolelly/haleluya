import type { DailySales } from "./types";

// Data dummy 60 hari x 4 produk (fiktif, konsisten dengan katalog BelanjAI
// lain di proyek ini). Pola sengaja dirancang mencakup: tren naik, tren
// turun, stagnan, dan lonjakan/penurunan mendadak (anomali) — supaya
// analytics.ts punya bahan yang representatif untuk dianalisis.
//
// Noise dibuat deterministik (bukan Math.random()) lewat trik sin(seed)
// supaya angkanya konsisten setiap kali di-generate ulang (server restart,
// build ulang, dst.) — penting untuk demo yang bisa diulang.

const START_DATE = "2026-06-06";
const DAYS = 60;

function addDays(iso: string, offset: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + offset);
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function noise(seed: number, amplitude: number): number {
  const x = Math.sin(seed) * 10000;
  const frac = x - Math.floor(x);
  return (frac - 0.5) * 2 * amplitude;
}

function clampUnits(value: number): number {
  return Math.max(0, Math.round(value));
}

interface ProductDef {
  name: string;
  price: number;
  unitsForDay: (dayIndex: number) => number;
}

const PRODUCTS: ProductDef[] = [
  {
    name: "Sepatu Lari UltraBoost Runner",
    price: 459000,
    // Tren naik: permintaan tumbuh dari ~3 ke ~9 unit/hari selama periode.
    unitsForDay: (day) => {
      const base = 3 + (day / (DAYS - 1)) * 6;
      return clampUnits(base + noise(day * 1.7 + 1, 1.3));
    },
  },
  {
    name: "Rice Cooker MiniCook 1L",
    price: 219000,
    // Stagnan: fluktuasi kecil di sekitar rata-rata tetap ~5.5 unit/hari.
    unitsForDay: (day) => {
      const base = 5.5;
      return clampUnits(base + noise(day * 2.3 + 7, 1.4));
    },
  },
  {
    name: "Kemeja Linen Pria Breezy",
    price: 149000,
    // Tren turun: permintaan menurun dari ~10 ke ~3 unit/hari.
    unitsForDay: (day) => {
      const base = 10 - (day / (DAYS - 1)) * 7;
      return clampUnits(base + noise(day * 1.3 + 13, 1.3));
    },
  },
  {
    name: "Headphone Wireless SoundWave Pro",
    price: 399000,
    // Stagnan dengan anomali: stockout singkat lalu lonjakan flash sale
    // yang diikuti penurunan (kehabisan stok setelah lonjakan).
    unitsForDay: (day) => {
      if (day === 12) return 0; // stockout mendadak
      if (day === 35) return 15; // lonjakan flash sale
      if (day === 36) return 1; // kehabisan stok pasca-lonjakan
      const base = 4.5;
      return clampUnits(base + noise(day * 1.9 + 21, 1.1));
    },
  },
];

export const SALES_PERIOD_START = START_DATE;
export const SALES_PERIOD_END = addDays(START_DATE, DAYS - 1);

export const DUMMY_SALES: DailySales[] = PRODUCTS.flatMap((product) =>
  Array.from({ length: DAYS }, (_, day) => {
    const units = product.unitsForDay(day);
    return {
      date: addDays(START_DATE, day),
      product: product.name,
      units,
      revenue: units * product.price,
    };
  }),
);
