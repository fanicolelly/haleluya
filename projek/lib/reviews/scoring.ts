import type { Review, ReviewScore, ScoreFactor, Verdict } from "./types";

// ============================================================================
// HEURISTIK DEMO — BUKAN MODEL ML SUNGGUHAN.
//
// Fungsi-fungsi di file ini menghitung "skor kepercayaan" ulasan murni dari
// aturan sederhana di frontend (panjang teks, kecocokan kata kunci sentimen,
// kemiripan Jaccard antar-teks, dan jarak waktu posting). Ini dipakai untuk
// mensimulasikan sinyal-sinyal yang disebut di proposal:
// - panjang/keunikan teks
// - kesesuaian rating dengan sentimen kata dalam teks
// - kemiripan teks antar ulasan (indikasi template/copy-paste)
// - pola waktu posting yang berdekatan (indikasi serangan ulasan massal)
//
// Versi produksi akan mengganti seluruh isi file ini dengan pemanggilan
// model klasifikasi teks IndoBERT yang di-fine-tune untuk deteksi ulasan
// palsu, dikombinasikan dengan graph analysis akun (jaringan reviewer,
// histori akun, hubungan antar-akun) — bukan pencocokan kata kunci seperti
// di bawah ini.
//
// REUSABLE: scoreReviews() hanya butuh array Review (id, reviewerName, text,
// rating, postedAt). Untuk menyambungkan ke data ulasan asli, cukup pastikan
// data tersebut sesuai bentuk Review di lib/reviews/types.ts.
// ============================================================================

const GENERIC_WORDS = new Set([
  "barang",
  "bagus",
  "pengiriman",
  "cepat",
  "sesuai",
  "pesanan",
  "recommended",
  "seller",
  "mantap",
  "puas",
  "original",
  "top",
  "ok",
  "oke",
  "sip",
  "cocok",
  "murah",
  "aman",
  "rapi",
  "banget",
  "good",
  "nice",
]);

const POSITIVE_WORDS = [
  "bagus",
  "puas",
  "mantap",
  "cepat",
  "sesuai",
  "recommended",
  "suka",
  "nyaman",
  "keren",
  "top",
  "oke",
  "empuk",
  "responsif",
  "awet",
];

const NEGATIVE_WORDS = [
  "jelek",
  "buruk",
  "kecewa",
  "rusak",
  "lambat",
  "nipu",
  "palsu",
  "murahan",
  "lepas",
  "kelupas",
  "cacat",
  "robek",
  "bocor",
  "kekecilan",
  "kebesaran",
  "menyesal",
];

const STOPWORDS = new Set([
  "yang",
  "saya",
  "ini",
  "itu",
  "dan",
  "di",
  "ke",
  "dari",
  "untuk",
  "dengan",
  "tapi",
  "juga",
  "ada",
  "tidak",
  "jadi",
  "karena",
  "saat",
  "sudah",
  "belum",
  "akan",
  "bisa",
  "buat",
  "kalau",
  "gak",
  "nggak",
  "nya",
  "nih",
  "dong",
  "aja",
  "atau",
  "pada",
  "dua",
  "kali",
  "sangat",
  "saja",
  "bukan",
]);

const WEIGHTS = {
  genericText: 25,
  sentimentMismatch: 35,
  similarText: 30,
  burstPosting: 20,
};

const SIMILARITY_THRESHOLD = 0.45;
const SIMILARITY_MAX_WORDS = 15;
const BURST_WINDOW_MS = 24 * 60 * 60 * 1000;
const BURST_MIN_OTHERS = 2;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function jaccardSimilarity(wordsA: Set<string>, wordsB: Set<string>): number {
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let intersection = 0;
  wordsA.forEach((word) => {
    if (wordsB.has(word)) intersection += 1;
  });
  const union = wordsA.size + wordsB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function checkGenericText(tokens: string[]): { triggered: boolean; detail: string } {
  const wordCount = tokens.length;

  if (wordCount === 0) {
    return { triggered: true, detail: "Ulasan kosong, tidak ada teks untuk dianalisis." };
  }

  const genericHits = tokens.filter((token) => GENERIC_WORDS.has(token)).length;
  const genericRatio = genericHits / wordCount;

  if (wordCount <= 6) {
    return {
      triggered: true,
      detail: `Ulasan sangat pendek (${wordCount} kata), nyaris tanpa detail spesifik tentang produk.`,
    };
  }

  if (wordCount <= 15 && genericRatio >= 0.6) {
    return {
      triggered: true,
      detail: `Ulasan pendek (${wordCount} kata) dan didominasi frasa umum/template (${Math.round(
        genericRatio * 100,
      )}% kata generik) tanpa detail spesifik produk.`,
    };
  }

  return {
    triggered: false,
    detail: `Panjang ulasan wajar (${wordCount} kata) dengan detail yang cukup spesifik.`,
  };
}

function checkSentimentMismatch(text: string, rating: number): { triggered: boolean; detail: string } {
  const lower = text.toLowerCase();
  const positiveHits = POSITIVE_WORDS.filter((word) => lower.includes(word));
  const negativeHits = NEGATIVE_WORDS.filter((word) => lower.includes(word));
  const polarity = positiveHits.length - negativeHits.length;

  if (rating >= 4 && polarity < 0) {
    return {
      triggered: true,
      detail: `Rating ${rating} bintang, tapi teks memuat kata bernada negatif (${negativeHits.join(
        ", ",
      )}) tanpa kata positif yang sepadan.`,
    };
  }

  if (rating <= 2 && polarity > 0) {
    return {
      triggered: true,
      detail: `Rating ${rating} bintang, tapi teks memuat kata bernada positif (${positiveHits.join(
        ", ",
      )}) tanpa kata negatif yang sepadan.`,
    };
  }

  return {
    triggered: false,
    detail: `Nada teks konsisten dengan rating ${rating} bintang.`,
  };
}

function checkSimilarText(
  review: Review,
  allReviews: Review[],
  wordSets: Map<string, Set<string>>,
): { triggered: boolean; detail: string } {
  const myTokenCount = tokenize(review.text).length;

  if (myTokenCount > SIMILARITY_MAX_WORDS) {
    return {
      triggered: false,
      detail: "Ulasan cukup panjang, kecil kemungkinan hasil template/copy-paste.",
    };
  }

  const mySet = wordSets.get(review.id) ?? new Set<string>();
  let maxSimilarity = 0;
  let similarCount = 0;

  allReviews.forEach((other) => {
    if (other.id === review.id) return;
    if (tokenize(other.text).length > SIMILARITY_MAX_WORDS) return;

    const otherSet = wordSets.get(other.id) ?? new Set<string>();
    const similarity = jaccardSimilarity(mySet, otherSet);

    if (similarity >= SIMILARITY_THRESHOLD) {
      similarCount += 1;
      maxSimilarity = Math.max(maxSimilarity, similarity);
    }
  });

  if (similarCount > 0) {
    return {
      triggered: true,
      detail: `Teks mirip (~${Math.round(maxSimilarity * 100)}%) dengan ${similarCount} ulasan lain — indikasi teks disalin/template.`,
    };
  }

  return { triggered: false, detail: "Tidak ditemukan ulasan lain dengan teks yang mirip." };
}

function checkBurstPosting(review: Review, allReviews: Review[]): { triggered: boolean; detail: string } {
  const myTime = new Date(review.postedAt).getTime();

  const othersInWindow = allReviews.filter((other) => {
    if (other.id === review.id) return false;
    const delta = Math.abs(new Date(other.postedAt).getTime() - myTime);
    return delta <= BURST_WINDOW_MS;
  });

  if (othersInWindow.length >= BURST_MIN_OTHERS) {
    return {
      triggered: true,
      detail: `${othersInWindow.length} ulasan lain diposting dalam rentang 24 jam yang sama — pola umum pada serangan ulasan massal.`,
    };
  }

  return { triggered: false, detail: "Tidak ada lonjakan ulasan lain di sekitar waktu posting ini." };
}

export function scoreReviews(reviews: Review[]): ReviewScore[] {
  const wordSets = new Map<string, Set<string>>();
  reviews.forEach((review) => {
    const filtered = tokenize(review.text).filter((token) => !STOPWORDS.has(token));
    wordSets.set(review.id, new Set(filtered));
  });

  return reviews.map((review) => {
    const generic = checkGenericText(tokenize(review.text));
    const mismatch = checkSentimentMismatch(review.text, review.rating);
    const similar = checkSimilarText(review, reviews, wordSets);
    const burst = checkBurstPosting(review, reviews);

    const factors: ScoreFactor[] = [
      {
        id: "generic",
        label: "Panjang & keunikan teks",
        detail: generic.detail,
        weight: WEIGHTS.genericText,
        triggered: generic.triggered,
      },
      {
        id: "mismatch",
        label: "Kesesuaian rating & sentimen",
        detail: mismatch.detail,
        weight: WEIGHTS.sentimentMismatch,
        triggered: mismatch.triggered,
      },
      {
        id: "similar",
        label: "Kemiripan dengan ulasan lain",
        detail: similar.detail,
        weight: WEIGHTS.similarText,
        triggered: similar.triggered,
      },
      {
        id: "burst",
        label: "Pola waktu posting",
        detail: burst.detail,
        weight: WEIGHTS.burstPosting,
        triggered: burst.triggered,
      },
    ];

    const suspicion = factors.reduce((sum, factor) => sum + (factor.triggered ? factor.weight : 0), 0);
    const authenticityScore = Math.max(0, Math.min(100, 100 - suspicion));

    let verdict: Verdict = "asli";
    if (authenticityScore < 40) verdict = "mencurigakan";
    else if (authenticityScore < 70) verdict = "tinjau";

    return { reviewId: review.id, authenticityScore, verdict, factors };
  });
}

export function scoreReview(review: Review, allReviews: Review[]): ReviewScore {
  const hasReview = allReviews.some((r) => r.id === review.id);
  const scores = scoreReviews(hasReview ? allReviews : [...allReviews, review]);
  return scores.find((s) => s.reviewId === review.id)!;
}
