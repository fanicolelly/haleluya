export type OrderTabKey = "semua" | "diproses" | "dikirim" | "selesai" | "dibatalkan";

const TABS: { key: OrderTabKey; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "diproses", label: "Diproses" },
  { key: "dikirim", label: "Dikirim" },
  { key: "selesai", label: "Selesai" },
  { key: "dibatalkan", label: "Dibatalkan" },
];

export default function OrderStatusTabs({
  active,
  onChange,
  counts,
}: {
  active: OrderTabKey;
  onChange: (key: OrderTabKey) => void;
  counts: Record<OrderTabKey, number>;
}) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-line pb-4">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          aria-pressed={active === tab.key}
          className={
            "rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors " +
            (active === tab.key
              ? "bg-brand text-white"
              : "border border-line text-ink-soft hover:border-brand/40")
          }
        >
          {tab.label} ({counts[tab.key]})
        </button>
      ))}
    </div>
  );
}
