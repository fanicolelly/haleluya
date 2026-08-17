import { getAllProducts } from "@/lib/products/catalog";
import ProductCard from "@/components/products/ProductCard";

export const metadata = {
  title: "Produk — BelanjAI",
};

export default function ProdukPage() {
  const products = getAllProducts();

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Semua Produk</h1>
      <p className="mt-2 text-sm text-ink-soft">{products.length} produk tersedia di katalog.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
