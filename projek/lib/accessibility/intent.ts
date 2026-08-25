// BENAR-BENAR BERFUNGSI (bukan simulasi): fungsi ini benar-benar dijalankan
// terhadap transkrip hasil Web Speech API, dan benar-benar mengambil produk
// dari katalog lewat retrieval TF-IDF + cosine similarity yang sama dengan
// fitur chatbot (lib/chat/retrieval.ts) — jadi perintah "cari sepatu lari"
// sungguh menampilkan produk sepatu lari dari katalog, dan "masukkan ke
// keranjang" sungguh menambah produk ke keranjang lewat ShopContext.
//
// Klasifikasi intent-nya sendiri masih berbasis kata kunci (bukan model
// NLU/ML terlatih), tapi sudah jauh lebih tahan banting dibanding versi
// sebelumnya yang memakai `String.includes` + ambil aturan pertama yang
// cocok. Lihat matchRule() di bawah untuk detail penskorannya.
//
// Versi produksi akan memakai model klasifikasi intent terlatih (mis. model
// NLU/LLM) yang memahami parafrase, sinonim, dan kesalahan ASR jauh lebih
// baik daripada daftar kata kunci apa pun.

import { retrieveProducts } from "@/lib/chat/retrieval";
import type { RetrievedProduct } from "@/lib/chat/types";

export type IntentId =
  | "cari"
  | "beli"
  | "cek_harga"
  | "cek_stok"
  | "baca_deskripsi"
  | "baca_ulasan"
  | "tambah_keranjang"
  | "tambah_wishlist"
  | "buka_keranjang"
  | "buka_wishlist"
  | "buka_pesanan"
  | "buka_kategori"
  | "buka_bantuan"
  | "buka_profil"
  | "buka_pengaturan"
  | "buka_beranda"
  | "daftar_perintah"
  | "tidak_dikenali";

/** Aksi nyata yang harus dijalankan komponen setelah intent dikenali. */
export type IntentAction = "tambah_keranjang" | "tambah_wishlist";

export interface IntentNav {
  route: string;
  label: string;
}

export interface IntentResult {
  id: IntentId;
  label: string;
  response: string;
  products?: RetrievedProduct[];
  nav?: IntentNav;
  /** Diisi hanya kalau ada produk yang benar-benar bisa dikenai aksi. */
  action?: { type: IntentAction; product: RetrievedProduct };
  /** Diisi untuk intent "daftar_perintah" — contoh perintah yang didukung. */
  examples?: string[];
}

interface IntentRule {
  id: Exclude<IntentId, "tidak_dikenali">;
  label: string;
  keywords: string[];
  nav?: IntentNav;
}

// Urutan aturan = prioritas saat skor seri. Aturan navigasi sengaja
// diletakkan SEBELUM aturan aksi keranjang/wishlist: kalau pengguna cuma
// menyebut kata bendanya ("keranjang"), membuka halaman keranjang lebih
// aman daripada diam-diam menambahkan produk yang belum tentu ia maksud.
const INTENT_RULES: IntentRule[] = [
  // --- Navigasi halaman (hanya kata benda khasnya, tanpa verba umum
  // seperti "buka"/"lihat" — verba umum itu milik intent "cari", dan
  // kalau ikut ditaruh di sini "lihat sepatu" bisa salah jadi navigasi).
  {
    id: "buka_keranjang",
    label: "Buka Keranjang",
    keywords: ["keranjang", "troli"],
    nav: { route: "/keranjang", label: "Buka Keranjang" },
  },
  {
    id: "buka_wishlist",
    label: "Buka Wishlist",
    keywords: ["wishlist", "favorit", "kesukaan"],
    nav: { route: "/wishlist", label: "Buka Wishlist" },
  },
  {
    id: "buka_pesanan",
    label: "Buka Pesanan",
    keywords: ["pesanan", "lacak", "resi", "riwayat", "transaksi", "pengiriman"],
    nav: { route: "/pesanan", label: "Buka Pesanan Saya" },
  },
  {
    id: "buka_kategori",
    label: "Buka Kategori",
    keywords: ["kategori"],
    nav: { route: "/kategori", label: "Buka Kategori" },
  },
  {
    id: "buka_bantuan",
    label: "Buka Bantuan",
    keywords: ["bantuan", "faq", "keluhan", "komplain"],
    nav: { route: "/bantuan", label: "Buka Pusat Bantuan" },
  },
  {
    id: "buka_profil",
    label: "Buka Profil",
    keywords: ["profil", "akun"],
    nav: { route: "/profil", label: "Buka Profil" },
  },
  {
    id: "buka_pengaturan",
    label: "Buka Pengaturan",
    keywords: ["pengaturan", "setelan", "setting"],
    nav: { route: "/pengaturan", label: "Buka Pengaturan" },
  },
  {
    id: "buka_beranda",
    label: "Buka Beranda",
    keywords: ["beranda", "home", "halaman utama"],
    nav: { route: "/", label: "Buka Beranda" },
  },

  // --- Aksi nyata terhadap produk
  {
    id: "tambah_keranjang",
    label: "Tambah ke Keranjang",
    keywords: ["tambah", "tambahkan", "masukkan", "masukin", "taruh", "keranjang", "troli"],
  },
  {
    id: "tambah_wishlist",
    label: "Simpan ke Wishlist",
    keywords: ["simpan", "simpankan", "sukai", "wishlist", "favorit"],
  },

  // --- Pertanyaan tentang produk
  {
    id: "cek_harga",
    label: "Cek Harga",
    keywords: ["harga", "berapa", "mahal", "murah", "biaya"],
  },
  {
    id: "cek_stok",
    label: "Cek Stok",
    keywords: ["stok", "tersedia", "ready", "sisa", "habis"],
  },
  {
    id: "baca_ulasan",
    label: "Baca Ulasan",
    keywords: ["ulasan", "review", "rating", "testimoni", "bintang", "penilaian"],
  },
  {
    id: "baca_deskripsi",
    label: "Baca Deskripsi",
    keywords: ["deskripsi", "detail", "jelaskan", "spesifikasi", "spek", "ceritakan", "informasi"],
  },
  {
    id: "beli",
    label: "Beli / Checkout",
    keywords: ["beli", "belikan", "checkout", "pesan", "order", "bayar"],
  },
  {
    id: "cari",
    label: "Cari Produk",
    keywords: [
      "cari",
      "carikan",
      "cariin",
      "temukan",
      "tunjukkan",
      "tampilkan",
      "lihat",
      "rekomendasi",
      "rekomendasikan",
      "sarankan",
      "butuh",
      "pengen",
      "ingin",
      "mau",
    ],
  },

  // --- Meta
  {
    id: "daftar_perintah",
    label: "Daftar Perintah",
    keywords: ["perintah", "kemampuan", "contoh", "panduan"],
  },
];

/** Contoh perintah yang ditawarkan ke pengguna (juga dipakai sebagai chip di UI). */
export const COMMAND_EXAMPLES: string[] = [
  "cari sepatu lari",
  "berapa harga tas ransel",
  "masukkan headphone ke keranjang",
  "simpan serum wajah ke wishlist",
  "cek stok smartwatch",
  "jelaskan blender portable",
  "bacakan ulasan sepatu lari",
  "buka keranjang saya",
  "lacak pesanan saya",
  "buka pusat bantuan",
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

// Skor sebuah aturan = jumlah panjang setiap kata kunci berbeda yang cocok.
// Menjumlahkan (bukan mengambil yang terpanjang saja) penting supaya frasa
// yang menyebut verba DAN kata benda menang atas yang cuma menyebut salah
// satu — mis. "tambahkan sepatu ke keranjang" (tambah + keranjang = 15)
// mengalahkan aturan navigasi yang hanya cocok di "keranjang" (9), sedangkan
// "buka keranjang" (9 lawan 9) seri dan jatuh ke aturan navigasi karena
// urutannya lebih dulu di INTENT_RULES.
function scoreRule(rule: IntentRule, tokens: string[]): number {
  let score = 0;

  for (const keyword of rule.keywords) {
    const matched = tokens.some(
      (token) =>
        token === keyword ||
        // Prefiks hanya untuk kata kunci >= 4 huruf, supaya imbuhan tertangkap
        // ("carikan" ← "cari") tanpa memicu kecocokan kebetulan pada kata
        // pendek. Kata kunci yang lebih spesifik tetap menang lewat skor:
        // "pesanan" (7) mengalahkan "pesan" (5) pada kalimat "cek pesanan".
        (keyword.length >= 4 && token.startsWith(keyword)),
    );
    if (matched) score += keyword.length;
  }

  return score;
}

function matchRule(text: string): IntentRule | null {
  const tokens = tokenize(text);
  let best: IntentRule | null = null;
  let bestScore = 0;

  for (const rule of INTENT_RULES) {
    const score = scoreRule(rule, tokens);
    // `>` (bukan `>=`) menjaga urutan INTENT_RULES sebagai pemecah seri.
    if (score > bestScore) {
      best = rule;
      bestScore = score;
    }
  }

  return best;
}

function rupiah(amount: number): string {
  return "Rp" + amount.toLocaleString("id-ID");
}

export function classifyIntent(rawText: string): IntentResult {
  const rule = matchRule(rawText);

  if (!rule) {
    return {
      id: "tidak_dikenali",
      label: "Tidak dikenali",
      response:
        "Maaf, saya belum mengenali perintah itu. Coba katakan misalnya “cari sepatu lari”, “masukkan headphone ke keranjang”, atau “perintah apa saja yang bisa?”.",
      examples: COMMAND_EXAMPLES,
    };
  }

  if (rule.id === "daftar_perintah") {
    return {
      id: rule.id,
      label: rule.label,
      response: `Ada ${COMMAND_EXAMPLES.length} contoh perintah yang bisa Anda coba, mulai dari mencari produk, menambah ke keranjang, sampai membuka halaman pesanan.`,
      examples: COMMAND_EXAMPLES,
    };
  }

  if (rule.nav) {
    return {
      id: rule.id,
      label: rule.label,
      response: `Membuka halaman ${rule.label.replace(/^Buka /, "")}.`,
      nav: rule.nav,
    };
  }

  const relevant = retrieveProducts(rawText, 4).filter((product) => product.score > 0);
  const top = relevant[0];

  // Semua intent di bawah butuh produk. Kalau retrieval tidak menemukan apa
  // pun, jawab jujur "tidak ketemu" alih-alih menebak produk sembarangan.
  if (!top) {
    return {
      id: rule.id,
      label: rule.label,
      response: `Saya mengenali perintah "${rule.label}", tapi belum menemukan produk yang cocok dengan "${rawText}" di katalog.`,
    };
  }

  switch (rule.id) {
    case "cari":
      return {
        id: rule.id,
        label: rule.label,
        response: `Menemukan ${relevant.length} produk yang cocok dengan "${rawText}".`,
        products: relevant,
      };

    case "beli":
      return {
        id: rule.id,
        label: rule.label,
        response: `Menemukan "${top.name}" seharga ${rupiah(top.price)}. Tekan produk di bawah untuk lanjut ke halaman pembelian.`,
        products: relevant,
      };

    case "tambah_keranjang":
      return {
        id: rule.id,
        label: rule.label,
        response: `${top.name} (${rupiah(top.price)}) ditambahkan ke keranjang.`,
        products: [top],
        action: { type: "tambah_keranjang", product: top },
      };

    case "tambah_wishlist":
      return {
        id: rule.id,
        label: rule.label,
        response: `${top.name} disimpan ke wishlist.`,
        products: [top],
        action: { type: "tambah_wishlist", product: top },
      };

    case "cek_harga":
      return {
        id: rule.id,
        label: rule.label,
        response: `${top.name} harganya ${rupiah(top.price)}.`,
        products: [top],
      };

    case "cek_stok":
      return {
        id: rule.id,
        label: rule.label,
        response:
          top.stock > 0
            ? `${top.name} masih tersedia, sisa ${top.stock} unit.`
            : `${top.name} sedang habis stok.`,
        products: [top],
      };

    case "baca_deskripsi":
      return {
        id: rule.id,
        label: rule.label,
        response: `${top.name}. ${top.desc}`,
        products: [top],
      };

    case "baca_ulasan":
      return {
        id: rule.id,
        label: rule.label,
        response: `${top.name} punya rating ${top.rating} dari pembeli. Pada versi produksi, saya juga akan membacakan ringkasan ulasannya.`,
        products: [top],
      };

    // Intent navigasi & daftar perintah sudah ditangani lewat early return di
    // atas, jadi cabang ini tidak pernah tercapai saat runtime. Tetap ditulis
    // karena TypeScript tidak bisa menyempitkan `rule.id` dari pemeriksaan
    // `rule.nav` sebelumnya.
    default:
      return {
        id: rule.id,
        label: rule.label,
        response: `Menampilkan hasil untuk "${rawText}".`,
        products: relevant,
      };
  }
}
