import { notFound } from "next/navigation";
import { getAllProducts, getProductById, getSimilarProducts } from "@/lib/products/catalog";
import Breadcrumb from "@/components/products/Breadcrumb";
import ProductDetailContent from "@/components/products/ProductDetailContent";

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);

  return {
    title: product ? `${product.name} — BelanjAI` : "Produk tidak ditemukan — BelanjAI",
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const similarProducts = getSimilarProducts(product, 4);

  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumb category={product.category} productName={product.name} />

      <div className="mt-6">
        <ProductDetailContent product={product} similarProducts={similarProducts} />
      </div>
    </div>
  );
}
