import type { Review } from "./types";

// Data ulasan dummy untuk demo — 10 ulasan produk fiktif "Sepatu Lari
// UltraBoost Runner" (nama produk sama dengan katalog dummy di lib/products.ts).
// Campuran sengaja dibuat: sebagian terlihat asli (detail, unik, nada teks
// konsisten dengan rating), sebagian sengaja dibuat mencurigakan (pendek,
// template mirip antar-akun, diposting berdekatan, atau rating tidak sesuai
// nada teks) supaya heuristik di scoring.ts punya sinyal untuk dievaluasi.
export const dummyReviews: Review[] = [
  {
    id: "r1",
    reviewerName: "Rina Kusuma",
    rating: 5,
    postedAt: "2026-07-10",
    text: "Sepatu ini benar-benar nyaman dipakai lari pagi, bantalan solnya empuk tapi tetap responsif. Sudah saya pakai tiga minggu dan belum ada tanda aus. Ukurannya pas sesuai chart size dari toko.",
  },
  {
    id: "r2",
    reviewerName: "Budi Santoso",
    rating: 5,
    postedAt: "2026-07-21",
    text: "Barang bagus, pengiriman cepat, sesuai pesanan. Recommended seller!",
  },
  {
    id: "r3",
    reviewerName: "Dewi Lestari",
    rating: 5,
    postedAt: "2026-07-21",
    text: "Barang bagus, pengiriman cepat, sesuai pesanan, recommended banget!",
  },
  {
    id: "r4",
    reviewerName: "Agus Wijaya",
    rating: 5,
    postedAt: "2026-07-22",
    text: "Barang bagus, pengiriman cepat banget, sesuai pesanan. Recommended!",
  },
  {
    id: "r5",
    reviewerName: "Siti Rahayu",
    rating: 2,
    postedAt: "2026-07-14",
    text: "Awalnya ragu karena baca beberapa ulasan campur aduk, tapi setelah pakai dua minggu ternyata solnya mulai kelupas di bagian ujung. Kecewa karena harganya tidak murah, meski customer service cukup responsif waktu saya komplain.",
  },
  {
    id: "r6",
    reviewerName: "Wahyu Prasetyo",
    rating: 5,
    postedAt: "2026-07-25",
    text: "Produknya jelek, ukuran kekecilan dan jahitan lepas setelah dua kali pakai, sangat kecewa dan menyesal beli ini.",
  },
  {
    id: "r7",
    reviewerName: "Made Arta",
    rating: 4,
    postedAt: "2026-07-27",
    text: "Kualitas oke untuk harga segini, empuk dipakai jalan santai tapi kurang cocok buat lari jarak jauh karena bantalan tumitnya kurang tebal. Warna sesuai foto.",
  },
  {
    id: "r8",
    reviewerName: "Farah Amelia",
    rating: 1,
    postedAt: "2026-07-16",
    text: "Barangnya beda jauh sama foto, bahannya terasa murahan, jahitan sudah lepas padahal baru dipakai sekali. Kecewa berat, sudah minta refund tapi susah dihubungi tokonya.",
  },
  {
    id: "r9",
    reviewerName: "Toko Sukses88",
    rating: 5,
    postedAt: "2026-07-21",
    text: "top",
  },
  {
    id: "r10",
    reviewerName: "Yusuf Hidayat",
    rating: 3,
    postedAt: "2026-07-30",
    text: "Standar saja, tidak istimewa tapi juga tidak jelek. Sesuai harga menurut saya, cocok untuk pemakaian santai bukan untuk olahraga berat.",
  },
];
