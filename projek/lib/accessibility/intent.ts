// BENAR-BENAR BERFUNGSI (bukan simulasi): fungsi ini benar-benar dijalankan
// terhadap transkrip hasil Web Speech API. Namun klasifikasinya sengaja
// dibuat sederhana (keyword matching), bukan model NLU/ML sungguhan.
// Versi produksi akan memakai model klasifikasi intent terlatih (mis. model
// NLU/LLM) yang jauh lebih tahan terhadap variasi kalimat, sinonim, dan
// kesalahan ASR, dibanding pencocokan kata kunci di bawah ini.

export type IntentId = "beli" | "cari" | "cek_harga" | "baca_ulasan" | "tidak_dikenali";

export interface IntentResult {
  id: IntentId;
  label: string;
  response: string;
}

interface IntentRule {
  id: IntentId;
  label: string;
  keywords: string[];
  response: string;
}

const INTENT_RULES: IntentRule[] = [
  {
    id: "beli",
    label: "Beli / Checkout",
    keywords: ["beli", "checkout", "pesan", "order"],
    response:
      "Saya mendeteksi perintah untuk membeli produk. Pada versi produksi, saya akan melanjutkan ke proses checkout.",
  },
  {
    id: "cari",
    label: "Cari Produk",
    keywords: ["cari", "carikan", "temukan", "tunjukkan"],
    response:
      "Saya mendeteksi perintah untuk mencari produk. Pada versi produksi, saya akan menampilkan hasil pencarian yang relevan dari katalog.",
  },
  {
    id: "cek_harga",
    label: "Cek Harga",
    keywords: ["harga", "berapa"],
    response:
      "Saya mendeteksi perintah untuk mengecek harga. Pada versi produksi, saya akan membacakan harga produk yang dimaksud.",
  },
  {
    id: "baca_ulasan",
    label: "Baca Ulasan",
    keywords: ["ulasan", "review", "rating"],
    response:
      "Saya mendeteksi perintah untuk membaca ulasan. Pada versi produksi, saya akan membacakan ringkasan ulasan produk.",
  },
];

export function classifyIntent(rawText: string): IntentResult {
  const text = rawText.toLowerCase();
  const matched = INTENT_RULES.find((rule) => rule.keywords.some((keyword) => text.includes(keyword)));

  if (matched) {
    return matched;
  }

  return {
    id: "tidak_dikenali",
    label: "Tidak dikenali",
    response:
      "Maaf, saya belum mengenali perintah itu. Coba katakan misalnya “cari sepatu lari” atau “berapa harga tas ini”.",
  };
}
