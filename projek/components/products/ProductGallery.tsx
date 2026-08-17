"use client";

import { useState } from "react";
import ProductImagePlaceholder from "@/components/products/ProductImagePlaceholder";
import type { Product } from "@/lib/products/types";

export default function ProductGallery({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-line">
        <ProductImagePlaceholder
          category={product.category}
          variantIndex={activeIndex}
          className="aspect-square w-full"
          iconSize={64}
        />
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
        {product.images.map((seed, index) => (
          <button
            key={seed}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Lihat gambar ${index + 1}`}
            aria-pressed={activeIndex === index}
            className={`overflow-hidden rounded-lg border-2 transition-colors ${
              activeIndex === index ? "border-brand" : "border-transparent hover:border-line"
            }`}
          >
            <ProductImagePlaceholder
              category={product.category}
              variantIndex={index}
              className="aspect-square w-full"
              iconSize={20}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
