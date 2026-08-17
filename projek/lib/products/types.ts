export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  desc: string;
  longDescription: string;
  stock: number;
  // Seed identifier untuk placeholder gambar (lihat components/products/
  // ProductImagePlaceholder.tsx) — di produksi field ini akan berisi URL
  // foto asli, bentuknya (array string) sudah disiapkan sama persis.
  images: string[];
  specs: Record<string, string>;
}
