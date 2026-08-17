export type SortOption = "terbaru" | "harga-asc" | "harga-desc" | "rating-desc";

const RATING_OPTIONS = [0, 3.5, 4, 4.5];

export default function CategoryFilterBar({
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  minRating,
  onMinRatingChange,
  sortBy,
  onSortByChange,
  onReset,
}: {
  priceMin: string;
  priceMax: string;
  onPriceMinChange: (value: string) => void;
  onPriceMaxChange: (value: string) => void;
  minRating: number;
  onMinRatingChange: (value: number) => void;
  sortBy: SortOption;
  onSortByChange: (value: SortOption) => void;
  onReset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="price-min" className="block text-xs font-medium text-ink-soft">
            Harga Min
          </label>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="font-mono text-xs text-ink-soft">Rp</span>
            <input
              id="price-min"
              type="number"
              min={0}
              placeholder="0"
              value={priceMin}
              onChange={(event) => onPriceMinChange(event.target.value)}
              className="w-24 rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs text-ink focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="price-max" className="block text-xs font-medium text-ink-soft">
            Harga Maks
          </label>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="font-mono text-xs text-ink-soft">Rp</span>
            <input
              id="price-max"
              type="number"
              min={0}
              placeholder="Tanpa batas"
              value={priceMax}
              onChange={(event) => onPriceMaxChange(event.target.value)}
              className="w-28 rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs text-ink focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        <div>
          <span className="block text-xs font-medium text-ink-soft">Rating Minimum</span>
          <div className="mt-1.5 flex gap-1.5">
            {RATING_OPTIONS.map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => onMinRatingChange(rating)}
                aria-pressed={minRating === rating}
                className={
                  "rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors " +
                  (minRating === rating
                    ? "border-brand bg-brand-soft text-brand"
                    : "border-line text-ink-soft hover:border-brand/40")
                }
              >
                {rating === 0 ? "Semua" : `${rating}+`}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="sort-by" className="block text-xs font-medium text-ink-soft">
            Urutkan
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(event) => onSortByChange(event.target.value as SortOption)}
            className="mt-1.5 rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs text-ink focus:border-brand focus:outline-none"
          >
            <option value="terbaru">Terbaru</option>
            <option value="harga-asc">Harga Termurah</option>
            <option value="harga-desc">Harga Termahal</option>
            <option value="rating-desc">Rating Tertinggi</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="ml-auto text-xs font-medium text-ink-soft hover:text-brand"
        >
          Reset filter
        </button>
      </div>
    </div>
  );
}
