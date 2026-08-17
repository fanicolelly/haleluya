export default function ProductSpecs({ specs }: { specs: Record<string, string> }) {
  const entries = Object.entries(specs);

  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <h2 className="text-sm font-semibold text-ink">Spesifikasi</h2>
      <dl className="mt-4 divide-y divide-line">
        {entries.map(([key, value]) => (
          <div key={key} className="grid grid-cols-1 gap-1 py-2.5 text-sm sm:grid-cols-[200px_1fr] sm:gap-4">
            <dt className="text-ink-soft">{key}</dt>
            <dd className="text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
