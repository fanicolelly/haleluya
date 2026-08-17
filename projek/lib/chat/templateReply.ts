import type { RetrievedProduct } from "./types";

// ============================================================================
// FALLBACK GENERATION (tanpa API key) — bukan LLM sungguhan.
//
// Supaya demo ini bisa langsung dijalankan tanpa perlu membuat/mengisi API
// key apa pun, jawaban di bawah disusun dari TEMPLATE teks yang mengisi data
// produk hasil retrieval secara langsung — bukan dikarang (field yang
// ditampilkan memang disalin apa adanya dari data retrieval), tapi juga
// bukan generative language model.
//
// Kalau ANTHROPIC_API_KEY diisi di .env.local (opsional), app/api/chat/route.ts
// akan memakai Claude sungguhan untuk jawaban yang jauh lebih natural &
// fleksibel terhadap variasi pertanyaan. Fungsi di file ini hanya dipakai
// sebagai fallback ketika key tidak ada, atau panggilan ke Claude gagal.
// ============================================================================

function rupiah(amount: number): string {
  return "Rp" + amount.toLocaleString("id-ID");
}

const PRICE_KEYWORDS = ["harga", "berapa"];

function isPriceFocused(query: string): boolean {
  const lower = query.toLowerCase();
  return PRICE_KEYWORDS.some((keyword) => lower.includes(keyword));
}

const INTROS = [
  "Berdasarkan katalog kami, ini rekomendasi yang paling sesuai:",
  "Saya menemukan beberapa produk yang cocok untuk itu:",
  "Ini pilihan paling relevan dari katalog kami:",
];

function pickIntro(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return INTROS[hash % INTROS.length];
}

export function generateTemplateReply(query: string, retrieved: RetrievedProduct[]): string {
  const relevant = retrieved.filter((product) => product.score > 0);

  if (relevant.length === 0) {
    return `Maaf, saya belum menemukan produk yang benar-benar cocok untuk "${query}" di katalog kami. Coba gunakan kata kunci lain, misalnya nama kategori atau kebutuhan spesifiknya.`;
  }

  const [top, ...rest] = relevant;
  const alternatives =
    rest.length > 0
      ? ` Pilihan lain yang relevan: ${rest.map((product) => `${product.name} (${rupiah(product.price)})`).join(", ")}.`
      : "";

  if (isPriceFocused(query)) {
    return `${top.name} dibanderol ${rupiah(top.price)} (rating ${top.rating}). ${top.desc}${alternatives}`;
  }

  return `${pickIntro(query)} ${top.name} — ${rupiah(top.price)}, rating ${top.rating}. ${top.desc}${alternatives}`;
}
