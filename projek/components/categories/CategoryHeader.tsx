import type { CategoryInfo } from "@/lib/categories/data";

export default function CategoryHeader({
  category,
  productCount,
}: {
  category: CategoryInfo;
  productCount: number;
}) {
  const Icon = category.icon;

  return (
    <div className="flex items-start gap-4">
      <span
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${category.badge}`}
      >
        <Icon size={26} aria-hidden="true" />
      </span>
      <div>
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">{category.name}</h1>
        <p className="mt-1 font-mono text-xs text-ink-soft">{productCount} produk</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          {category.description}
        </p>
      </div>
    </div>
  );
}
