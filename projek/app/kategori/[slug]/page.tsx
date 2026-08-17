import { notFound } from "next/navigation";
import { CATEGORIES, getCategoryBySlug } from "@/lib/categories/data";
import { getProductsByCategory } from "@/lib/products/catalog";
import CategoryHeader from "@/components/categories/CategoryHeader";
import CategoryProductBrowser from "@/components/categories/CategoryProductBrowser";

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  return {
    title: category ? `${category.name} — BelanjAI` : "Kategori tidak ditemukan — BelanjAI",
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = getProductsByCategory(category.name);

  return (
    <div className="mx-auto max-w-6xl">
      <CategoryHeader category={category} productCount={products.length} />

      <div className="mt-8">
        <CategoryProductBrowser products={products} />
      </div>
    </div>
  );
}
