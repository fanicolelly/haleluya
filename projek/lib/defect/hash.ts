// BENAR-BENAR BERFUNGSI: SHA-256 dihitung sungguhan dari isi file gambar
// lewat Web Crypto API bawaan browser (crypto.subtle.digest), bukan
// simulasi. Ini mendemonstrasikan konsep "bukti digital" dari proposal —
// hash ini akan berubah total kalau isi file diubah sedikit pun.
//
// KETERBATASAN: hash ini cuma dihitung & ditampilkan di browser saat itu
// juga — belum disimpan ke tempat tepercaya (mis. dicatat di server dengan
// timestamp resmi, atau dinotarisasi ke blockchain) sehingga belum benar-
// benar tidak bisa dimanipulasi sebagai bukti sengketa produksi. Itu makanya
// kartu bukti di halaman ini eksplisit berlabel "prototipe/demo".
export async function sha256Hex(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
