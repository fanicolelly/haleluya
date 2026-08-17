import type { Product } from "@/lib/products/types";
import ProductCard from "@/components/products/ProductCard";

export default function SimilarProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold text-ink">Produk Serupa</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
