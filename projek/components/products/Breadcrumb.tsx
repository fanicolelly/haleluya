import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCategoryByName } from "@/lib/categories/data";

export default function Breadcrumb({
  category,
  productName,
}: {
  category: string;
  productName: string;
}) {
  const categoryInfo = getCategoryByName(category);
  const categoryHref = categoryInfo ? `/kategori/${categoryInfo.slug}` : "/kategori";

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-ink-soft">
      <Link href="/" className="hover:text-brand">
        Beranda
      </Link>
      <ChevronRight size={12} aria-hidden="true" />
      <Link href={categoryHref} className="hover:text-brand">
        {category}
      </Link>
      <ChevronRight size={12} aria-hidden="true" />
      <span className="line-clamp-1 text-ink">{productName}</span>
    </nav>
  );
}
