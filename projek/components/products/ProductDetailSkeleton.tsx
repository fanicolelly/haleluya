export default function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <div className="aspect-square w-full rounded-2xl bg-line" />
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="aspect-square rounded-lg bg-line" />
            ))}
          </div>
        </div>

        <div>
          <div className="h-3 w-20 rounded bg-line" />
          <div className="mt-2 h-7 w-3/4 rounded bg-line" />
          <div className="mt-3 h-4 w-24 rounded bg-line" />
          <div className="mt-4 h-8 w-40 rounded bg-line" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded bg-line" />
            <div className="h-3 w-full rounded bg-line" />
            <div className="h-3 w-2/3 rounded bg-line" />
          </div>
          <div className="mt-6 h-10 w-32 rounded-xl bg-line" />
          <div className="mt-6 flex gap-3">
            <div className="h-12 flex-1 rounded-xl bg-line" />
            <div className="h-12 w-12 rounded-xl bg-line" />
          </div>
        </div>
      </div>

      <div className="mt-12 h-48 rounded-2xl bg-line" />
    </div>
  );
}
