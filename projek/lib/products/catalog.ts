import productsData from "@/data/products.json";
import type { Product } from "./types";

// Sumber data tunggal untuk seluruh katalog produk (data/products.json) —
// dipakai bersama oleh fitur chatbot (lib/chat/retrieval.ts) dan halaman
// detail produk (app/produk/[id]).
// Type assertion (bukan anotasi kontekstual) diperlukan karena TypeScript
// menyimpulkan tipe union yang terlalu spesifik dari JSON ini — tiap produk
// punya key `specs` yang berbeda-beda, jadi inferensi otomatis menganggapnya
// bukan Record<string, string> yang seragam.
const products = productsData as unknown as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getSimilarProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((candidate) => candidate.category === product.category && candidate.id !== product.id)
    .slice(0, limit);
}

export function getProductsByCategory(categoryName: string): Product[] {
  return products.filter((product) => product.category === categoryName);
}
