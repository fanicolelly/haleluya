// ============================================================================
// SIMULASI / PLACEHOLDER — BUKAN model Siamese Network / CNN classifier
// sungguhan seperti yang disebut di proposal. Tidak ada model computer
// vision yang benar-benar "memahami" isi gambar (bentuk, tekstur, jenis
// cacat) di sini.
//
// Yang benar-benar dihitung di file ini murni operasi piksel sederhana di
// Canvas API browser:
// 1. Kedua gambar di-resize ke ukuran kecil seragam (32x32) & diubah ke
//    grayscale — supaya perbandingan tidak terpengaruh ukuran/orientasi asli.
// 2. "Selisih piksel": rata-rata selisih absolut nilai grayscale per piksel
//    antar dua gambar, dinormalisasi jadi persentase 0-100.
// 3. "Perceptual hash" sederhana (average hash / aHash): tiap piksel diberi
//    bit 1 kalau lebih terang dari rata-rata gambar itu, 0 kalau lebih
//    gelap — lalu dihitung jarak Hamming (jumlah bit yang beda) antar dua
//    hash sebagai sinyal kemiripan tambahan.
//
// Skor "konsistensi" hanyalah proxy kasar dari kemiripan visual piksel —
// BUKAN deteksi cacat/kerusakan sungguhan. Perubahan sudut foto, pencahayaan,
// atau kompresi JPEG juga akan menurunkan skor ini, persis seperti perubahan
// kerusakan sungguhan — model produksi (Siamese Network + CNN classifier
// cacat) dilatih supaya bisa membedakan keduanya, teknik di sini tidak bisa.
// ============================================================================

const SAMPLE_SIZE = 32;

async function toGrayscaleSamples(file: File, size: number): Promise<Uint8ClampedArray> {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context tidak tersedia di browser ini.");

    ctx.drawImage(bitmap, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);

    const gray = new Uint8ClampedArray(size * size);
    for (let i = 0; i < gray.length; i++) {
      const r = data[i * 4];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];
      gray[i] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    }
    return gray;
  } finally {
    bitmap.close();
  }
}

function pixelDifferencePercent(a: Uint8ClampedArray, b: Uint8ClampedArray): number {
  let totalDiff = 0;
  for (let i = 0; i < a.length; i++) {
    totalDiff += Math.abs(a[i] - b[i]);
  }
  const avgDiff = totalDiff / a.length; // 0-255
  return (avgDiff / 255) * 100;
}

function averageHashBits(gray: Uint8ClampedArray): string {
  const avg = gray.reduce((total, value) => total + value, 0) / gray.length;
  let bits = "";
  for (let i = 0; i < gray.length; i++) {
    bits += gray[i] > avg ? "1" : "0";
  }
  return bits;
}

function hammingDistance(a: string, b: string): number {
  let distance = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) distance += 1;
  }
  return distance;
}

export interface ImageComparisonResult {
  consistencyScore: number; // 0-100
  pixelDifferencePercent: number;
  hashHammingDistance: number;
  hashTotalBits: number;
}

export async function compareImages(before: File, after: File): Promise<ImageComparisonResult> {
  const [grayBefore, grayAfter] = await Promise.all([
    toGrayscaleSamples(before, SAMPLE_SIZE),
    toGrayscaleSamples(after, SAMPLE_SIZE),
  ]);

  const diffPercent = pixelDifferencePercent(grayBefore, grayAfter);
  const hashBefore = averageHashBits(grayBefore);
  const hashAfter = averageHashBits(grayAfter);
  const hashHammingDistance = hammingDistance(hashBefore, hashAfter);

  const consistencyScore = Math.max(0, Math.min(100, 100 - diffPercent));

  return {
    consistencyScore,
    pixelDifferencePercent: diffPercent,
    hashHammingDistance,
    hashTotalBits: hashBefore.length,
  };
}
