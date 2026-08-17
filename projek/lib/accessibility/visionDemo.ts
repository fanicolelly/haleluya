// SIMULASI / PLACEHOLDER — tidak ada model computer vision yang benar-benar
// berjalan di sini. Gambar yang diunggah pengguna TIDAK dianalisis sama
// sekali; fungsi ini hanya memilih salah satu hasil dummy di bawah secara
// deterministik (berdasarkan nama + ukuran file) supaya demo terasa hidup.
//
// Versi produksi akan mengganti seluruh isi file ini dengan pemanggilan
// model computer vision sungguhan, misalnya:
// - CLIP (atau embedding model sejenis) untuk mencocokkan foto dengan
//   produk di katalog berdasarkan kemiripan visual, atau
// - YOLO (atau object detector sejenis) untuk mendeteksi objek pada foto
//   sebelum dicocokkan ke katalog.

export interface DetectedProduct {
  name: string;
  category: string;
  confidence: number;
}

const DUMMY_DETECTIONS: DetectedProduct[] = [
  { name: "Sepatu Lari UltraBoost Runner", category: "Olahraga", confidence: 0.94 },
  { name: "Headphone Wireless SoundWave Pro", category: "Elektronik", confidence: 0.91 },
  { name: "Tas Ransel Laptop UrbanPack", category: "Fashion", confidence: 0.88 },
  { name: "Rice Cooker MiniCook 1L", category: "Rumah Tangga", confidence: 0.86 },
  { name: "Serum Wajah GlowDrop Vitamin C", category: "Kecantikan", confidence: 0.9 },
];

export function simulateDetection(file: File): DetectedProduct {
  const seed = `${file.name}-${file.size}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return DUMMY_DETECTIONS[hash % DUMMY_DETECTIONS.length];
}
