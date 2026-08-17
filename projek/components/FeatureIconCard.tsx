import Link from "next/link";
import type { Feature } from "@/lib/features";
import { ACCENT_STYLES } from "@/lib/accent";

export default function FeatureIconCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;

  return (
    <Link
      href={`/fitur/${feature.slug}`}
      className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-5 transition-colors hover:border-brand/40 hover:shadow-sm"
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${ACCENT_STYLES[feature.accent]}`}
      >
        <Icon size={20} strokeWidth={2} />
      </span>
      <div>
        <p className="text-sm font-semibold text-ink">{feature.navLabel}</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft">{feature.blurb}</p>
      </div>
    </Link>
  );
}
