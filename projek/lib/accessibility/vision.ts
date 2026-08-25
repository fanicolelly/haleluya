// BENAR-BENAR BERFUNGSI (bukan simulasi): file ini menjalankan model
// computer vision sungguhan — MobileNet V2 (CNN yang dilatih di ImageNet,
// 1000 kelas objek) — langsung di browser lewat TensorFlow.js. Piksel foto
// yang diunggah benar-benar dianalisis; TIDAK ada API eksternal berbayar
// dan tidak butuh API key.
//
// Alur lengkapnya:
//   foto → MobileNet (klasifikasi isi gambar) → label ImageNet (Inggris)
//        → LABEL_MAP (padankan ke kosakata katalog Indonesia)
//        → retrieveProducts() TF-IDF → produk di katalog BelanjAI
//
// Batasan yang jujur perlu dicatat:
// - MobileNet mengenali KATEGORI objek umum ("running shoe", "backpack"),
//   bukan merek/varian spesifik. Jadi hasil akhirnya adalah produk katalog
//   yang paling dekat kategorinya, bukan pencocokan visual per-produk.
// - ImageNet tidak punya kelas untuk semua produk kita (mis. power bank).
//   Objek di luar cakupan akan dilaporkan apa adanya sebagai "tidak ada
//   padanan di katalog", bukan ditebak sembarangan.
// - Bobot model (~14 MB) diunduh sekali dari CDN TensorFlow lalu di-cache
//   browser, jadi analisis pertama butuh koneksi internet.
//
// Untuk pencocokan visual per-produk (bukan sekadar kategori), langkah
// berikutnya adalah model embedding seperti CLIP: setiap foto produk di
// katalog di-embed sekali, lalu foto pengguna dicari tetangga terdekatnya.

import { retrieveProducts } from "@/lib/chat/retrieval";
import type { RetrievedProduct } from "@/lib/chat/types";

export interface VisionPrediction {
  /** Label mentah dari ImageNet, mis. "running shoe". */
  className: string;
  /** Probabilitas dari model, 0-1. */
  probability: number;
}

/** "cnn" = hasil analisis piksel MobileNet. "nama-file" = fallback offline. */
export type VisionMethod = "cnn" | "nama-file";

// Di bawah ambang ini hasilnya ditampilkan sebagai "tebakan terbaik", bukan
// deteksi yang meyakinkan. Objek di luar 1000 kelas ImageNet (mis. rice
// cooker) memang menghasilkan probabilitas rendah dan tersebar, jadi lebih
// jujur mengakui ketidakpastian daripada menyajikannya sebagai kepastian.
export const LOW_CONFIDENCE_THRESHOLD = 0.2;

export interface VisionResult {
  method: VisionMethod;
  /** Prediksi mentah model, ditampilkan apa adanya demi transparansi. */
  predictions: VisionPrediction[];
  /** Label ImageNet yang berhasil dipadankan ke katalog (null kalau tidak ada). */
  matchedLabel: string | null;
  product: RetrievedProduct | null;
  /** 0-1. Untuk metode "cnn" ini probabilitas asli dari model. */
  confidence: number;
}

interface LabelMapping {
  /** Potongan kata yang dicari di dalam label ImageNet (lowercase). */
  match: string[];
  /** Kata kunci bahasa Indonesia untuk dicari di katalog. */
  terms: string;
}

// Label ImageNet berupa daftar sinonim dipisah koma (mis. "backpack, back
// pack, knapsack, packsack, rucksack, haversack"), jadi pencocokan substring
// di bawah cukup tahan banting. Urutan penting: entri yang lebih spesifik
// ("running shoe") harus lebih dulu daripada yang umum ("shoe").
const LABEL_MAP: LabelMapping[] = [
  // Olahraga
  { match: ["running shoe", "cleat"], terms: "sepatu lari olahraga" },
  { match: ["sandal", "clog", "flip-flop"], terms: "sandal outdoor" },
  { match: ["dumbbell", "barbell"], terms: "resistance band set latihan" },
  { match: ["mat, matting", "yoga"], terms: "matras yoga" },
  { match: ["water bottle", "water jug", "pop bottle", "thermos"], terms: "botol minum olahraga" },
  { match: ["volleyball", "basketball", "soccer ball", "tennis ball", "rugby ball"], terms: "olahraga" },

  // Fashion (alas kaki umum sesudah "running shoe")
  { match: ["loafer", "sneaker", "oxford", "boot", "shoe"], terms: "sepatu sneakers casual" },
  { match: ["backpack", "knapsack", "rucksack", "packsack", "haversack"], terms: "tas ransel laptop" },
  { match: ["purse", "handbag", "wallet", "mailbag"], terms: "tas" },
  { match: ["jersey", "t-shirt", "tee shirt", "sweatshirt"], terms: "kaos polos premium" },
  { match: ["jean", "denim"], terms: "jaket denim celana" },
  { match: ["cardigan", "trench coat", "windbreaker", "poncho", "suit"], terms: "jaket windbreaker" },
  { match: ["gown", "miniskirt", "overskirt", "hoopskirt", "sarong"], terms: "dress casual wanita" },
  { match: ["cowboy hat", "sombrero", "bonnet", "shower cap", "mortarboard"], terms: "topi bucket hat" },
  { match: ["lab coat", "kimono", "abaya"], terms: "kemeja linen" },

  // Elektronik
  { match: ["cellular telephone", "cellphone", "cell phone", "mobile phone", "smartphone", "ipod"], terms: "smartphone kamera" },
  { match: ["digital watch", "analog watch", "stopwatch", "wristwatch", "sundial"], terms: "smartwatch jam" },
  { match: ["loudspeaker", "speaker"], terms: "speaker bluetooth portable" },
  { match: ["computer keyboard", "typewriter keyboard", "keypad", "space bar"], terms: "keyboard mechanical" },
  { match: ["mouse, computer mouse", "computer mouse"], terms: "mouse wireless" },
  { match: ["reflex camera", "polaroid camera", "camera", "lens cap"], terms: "kamera mirrorless" },
  { match: ["headphone", "earphone"], terms: "headphone wireless" },
  { match: ["radio", "cassette player", "tape player", "cd player"], terms: "speaker bluetooth" },
  { match: ["laptop", "notebook", "desktop computer", "monitor", "screen, crt"], terms: "keyboard mouse" },

  // Rumah tangga
  { match: ["vacuum"], terms: "vacuum cleaner portable" },
  { match: ["toaster"], terms: "toaster" },
  { match: ["electric fan", "blower"], terms: "kipas angin portable" },
  { match: ["smoothing iron", "iron, "], terms: "setrika uap" },
  { match: ["blender", "food processor", "mixer", "cocktail shaker"], terms: "blender portable" },
  // ImageNet tidak punya kelas "rice cooker". Foto rice cooker biasanya
  // jatuh ke tetangga terdekatnya (waffle iron / stove / Crock Pot), jadi
  // seluruh rumpun alat masak meja dipetakan ke rice cooker — produk
  // sejenis yang ada di katalog.
  {
    match: ["crock pot", "rice cooker", "pressure cooker", "steamer", "double boiler", "waffle iron", "hot plate", "stove", "rotisserie"],
    terms: "rice cooker",
  },
  { match: ["frying pan", "wok", "dutch oven", "caldron", "microwave", "pot, flowerpot"], terms: "air fryer" },
  { match: ["espresso maker", "coffeepot", "teapot", "water tower"], terms: "dispenser air" },

  // Kecantikan
  { match: ["sunscreen", "sunblock", "lotion"], terms: "sunscreen hand cream" },
  { match: ["lipstick", "lip rouge"], terms: "lip cream matte" },
  { match: ["perfume", "essence"], terms: "parfum" },
  { match: ["hair spray"], terms: "shampoo rambut" },
  { match: ["face powder", "powder"], terms: "masker wajah" },
  { match: ["toothbrush", "brush"], terms: "sikat gigi elektrik" },
  { match: ["pill bottle", "medicine chest"], terms: "serum wajah" },
];

function mapLabelToTerms(className: string): LabelMapping | null {
  const label = className.toLowerCase();
  return LABEL_MAP.find((entry) => entry.match.some((needle) => label.includes(needle))) ?? null;
}

// Model di-load malas (lazy) dan hanya sekali per sesi — promise-nya
// di-cache supaya unggahan berikutnya langsung memakai model yang sama.
let modelPromise: Promise<{ classify: (img: HTMLImageElement, topk?: number) => Promise<VisionPrediction[]> }> | null =
  null;

function loadModel() {
  if (!modelPromise) {
    modelPromise = (async () => {
      // Import dinamis: paket TensorFlow.js berat dan hanya dipakai di
      // halaman ini, jadi sengaja dipisah dari bundle utama.
      const tf = await import("@tensorflow/tfjs");
      await tf.ready();
      const mobilenet = await import("@tensorflow-models/mobilenet");
      // V2 alpha 1.0 = varian paling akurat yang masih wajar untuk browser.
      return mobilenet.load({ version: 2, alpha: 1.0 });
    })();

    // Kalau gagal (mis. offline), buang cache-nya supaya percobaan
    // berikutnya bisa mencoba memuat ulang, bukan gagal permanen.
    modelPromise.catch(() => {
      modelPromise = null;
    });
  }
  return modelPromise;
}

/** Memicu pengunduhan bobot model lebih awal, sebelum pengguna mengunggah foto. */
export function warmUpModel(): void {
  void loadModel().catch(() => {
    // Diabaikan — kegagalan ditangani saat analisis dengan fallback nama file.
  });
}

function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Gagal memuat gambar"));
    image.src = url;
  });
}

/** Fallback saat model tidak bisa dimuat (mis. tidak ada koneksi internet). */
function matchByFileName(file: File): VisionResult {
  const query = file.name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_.]+/g, " ");
  const [top] = retrieveProducts(query, 1);
  const matched = top && top.score > 0 ? top : null;

  return {
    method: "nama-file",
    predictions: [],
    matchedLabel: matched ? query.trim() : null,
    product: matched,
    confidence: matched ? Math.min(0.5 + matched.score * 0.5, 0.97) : 0,
  };
}

export async function recognizeImage(file: File, objectUrl: string): Promise<VisionResult> {
  let predictions: VisionPrediction[];

  try {
    const [model, image] = await Promise.all([loadModel(), loadImageElement(objectUrl)]);
    predictions = await model.classify(image, 5);
  } catch {
    return matchByFileName(file);
  }

  // Ambil prediksi berperingkat tertinggi yang punya padanan di katalog.
  // Prediksi teratas belum tentu ada produknya (mis. "golden retriever"),
  // jadi kita telusuri daftarnya, bukan hanya melihat yang pertama.
  for (const prediction of predictions) {
    const mapping = mapLabelToTerms(prediction.className);
    if (!mapping) continue;

    const [top] = retrieveProducts(mapping.terms, 1);
    if (!top || top.score === 0) continue;

    return {
      method: "cnn",
      predictions,
      matchedLabel: prediction.className,
      product: top,
      confidence: prediction.probability,
    };
  }

  // Model berhasil menganalisis gambar, tapi tidak ada objek yang cocok
  // dengan katalog. Prediksi mentahnya tetap dikembalikan supaya pengguna
  // tahu model "melihat" apa — jauh lebih berguna daripada tebakan asal.
  return {
    method: "cnn",
    predictions,
    matchedLabel: null,
    product: null,
    confidence: 0,
  };
}
