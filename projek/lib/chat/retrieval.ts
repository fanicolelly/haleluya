import { getAllProducts } from "@/lib/products/catalog";
import type { Product } from "@/lib/products/types";
import type { RetrievedProduct } from "./types";

// ============================================================================
// RETRIEVAL: TF-IDF + COSINE SIMILARITY (bukan embedding model sungguhan)
//
// Trade-off dibanding real embedding API (mis. Voyage AI / OpenAI embeddings):
// + Gratis, 100% lokal, tanpa API key/panggilan jaringan tambahan, dan
//   deterministik — cukup untuk katalog kecil seperti demo ini (25 produk).
// + Sudah jauh lebih baik dari keyword-matching murni di prototipe HTML:
//   kata yang jarang muncul di katalog (mis. nama produk spesifik) diberi
//   bobot lebih tinggi (IDF) dibanding kata umum ("dan", "untuk"), lalu
//   produk diranking pakai cosine similarity, bukan sekadar hitung jumlah
//   kata yang cocok.
// - TIDAK menangkap makna semantik/sinonim: query "gawai buat rekam video"
//   tidak otomatis nyambung ke "smartphone"/"kamera" kecuali kata itu literal
//   ada di deskripsi produk. Real embedding model memahami makna, bukan cuma
//   kecocokan kata literal — jauh lebih baik untuk query bahasa natural,
//   sinonim, atau typo.
// - Tidak scalable untuk katalog besar tanpa index approximate nearest
//   neighbor (mis. HNSW/vector DB). Untuk 25 produk ini bukan masalah, tapi
//   untuk ribuan produk perlu vector database sungguhan.
//
// Upgrade path ke real embedding: ganti isi productVectors di bawah dengan
// hasil panggilan embedding API per produk (dihitung & di-cache sekali saat
// katalog berubah, BUKAN setiap request) — retrieveProducts() di bawah tetap
// jalan apa adanya karena cuma butuh cosine similarity antar-vector.
// ============================================================================

const products = getAllProducts();

// Stopword umum Indonesia. Penting untuk katalog sekecil ini: tanpa filter
// ini, kata sambung yang kebetulan jarang muncul di 14 dokumen (mis. "di")
// bisa mendapat IDF tinggi dan salah mendominasi skor kemiripan.
const STOPWORDS = new Set([
  "yang",
  "dan",
  "di",
  "ke",
  "dari",
  "untuk",
  "dengan",
  "atau",
  "ini",
  "itu",
  "juga",
  "ada",
  "tidak",
  "buat",
  "cocok",
  "hingga",
  "serta",
  "saat",
  "tanpa",
  "sangat",
  "lebih",
  "bisa",
  "akan",
  "pas",
  "dalam",
  "para",
  "pada",
  "sebagai",
  "adalah",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((token) => token.length > 0 && !STOPWORDS.has(token));
}

function termCounts(tokens: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  tokens.forEach((token) => counts.set(token, (counts.get(token) ?? 0) + 1));
  return counts;
}

function documentText(product: Product): string {
  return `${product.name} ${product.category} ${product.desc}`;
}

// Document frequency: di berapa banyak dokumen produk sebuah term muncul.
const documentFrequency = new Map<string, number>();
const productTermCounts = new Map<string, Map<string, number>>();

products.forEach((product) => {
  const counts = termCounts(tokenize(documentText(product)));
  productTermCounts.set(product.id, counts);
  counts.forEach((_count, term) => {
    documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
  });
});

const CORPUS_SIZE = products.length;

function idf(term: string): number {
  const df = documentFrequency.get(term) ?? 0;
  return Math.log((CORPUS_SIZE + 1) / (df + 1)) + 1;
}

function normalize(vector: Map<string, number>): Map<string, number> {
  let sumSquares = 0;
  vector.forEach((weight) => {
    sumSquares += weight * weight;
  });
  const magnitude = Math.sqrt(sumSquares);
  if (magnitude === 0) return vector;

  const normalized = new Map<string, number>();
  vector.forEach((weight, term) => normalized.set(term, weight / magnitude));
  return normalized;
}

function toTfIdfVector(counts: Map<string, number>): Map<string, number> {
  const vector = new Map<string, number>();
  counts.forEach((count, term) => {
    vector.set(term, count * idf(term));
  });
  return normalize(vector);
}

function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  const [smaller, larger] = a.size < b.size ? [a, b] : [b, a];
  let dot = 0;
  smaller.forEach((weight, term) => {
    const otherWeight = larger.get(term);
    if (otherWeight !== undefined) dot += weight * otherWeight;
  });
  return dot;
}

// Vektor TF-IDF setiap produk, dihitung sekali saat modul di-load (katalog statis).
const productVectors = new Map<string, Map<string, number>>();
productTermCounts.forEach((counts, id) => {
  productVectors.set(id, toTfIdfVector(counts));
});

function parsePriceLimit(query: string): number | null {
  const match = query.match(/(di\s*bawah|kurang dari|maks(?:imal)?)\s*([\d.,]+)\s*(rb|ribu|jt|juta)?/i);
  if (!match) return null;

  let value = parseFloat(match[2].replace(/\./g, "").replace(",", "."));
  const unit = (match[3] ?? "").toLowerCase();

  if (unit.startsWith("jt") || unit.startsWith("juta")) value *= 1_000_000;
  else if (unit.startsWith("rb") || unit.startsWith("ribu")) value *= 1_000;

  return value;
}

export function retrieveProducts(query: string, topK = 3): RetrievedProduct[] {
  const priceLimit = parsePriceLimit(query);
  const queryVector = toTfIdfVector(termCounts(tokenize(query)));

  let scored: RetrievedProduct[] = products.map((product) => ({
    ...product,
    score: cosineSimilarity(queryVector, productVectors.get(product.id) ?? new Map()),
  }));

  if (priceLimit !== null) {
    const withinBudget = scored.filter((product) => product.price <= priceLimit);
    if (withinBudget.length > 0) scored = withinBudget;
  }

  scored.sort((a, b) => b.score - a.score || b.rating - a.rating);

  const relevant = scored.filter((product) => product.score > 0).slice(0, topK);
  if (relevant.length > 0) return relevant;

  // Fallback: tidak ada satu pun kata di query yang cocok dengan katalog.
  // Tampilkan 2 produk rating tertinggi supaya panel grounding tidak kosong
  // total (meniru perilaku fallback di prototipe HTML).
  return scored.slice(0, 2);
}
