import type { FeatureStatus } from "@/lib/features";

const LABEL: Record<FeatureStatus, string> = {
  live: "Live demo",
  soon: "Coming soon",
};

export default function StatusBadge({ status }: { status: FeatureStatus }) {
  const isLive = status === "live";

  return (
    <span
      className={
        "inline-flex items-center rounded-full px-3 py-1 font-mono text-[10.5px] tracking-wide " +
        (isLive
          ? "bg-brand text-white"
          : "border border-line bg-transparent text-ink-soft")
      }
    >
      {LABEL[status]}
    </span>
  );
}
