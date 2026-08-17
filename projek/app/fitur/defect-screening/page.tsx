import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getFeature } from "@/lib/features";
import { ACCENT_STYLES } from "@/lib/accent";
import StatusBadge from "@/components/StatusBadge";
import DefectScreeningDemo from "@/components/defect/DefectScreeningDemo";

export const metadata = {
  title: "AI Damage/Defect Pre-Screening — BelanjAI",
};

export default function DefectScreeningPage() {
  const feature = getFeature("defect-screening");
  if (!feature) return null;

  const Icon = feature.icon;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs font-medium text-ink-soft hover:text-brand"
      >
        <ChevronLeft size={14} /> Kembali ke beranda
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${ACCENT_STYLES[feature.accent]}`}
        >
          <Icon size={20} strokeWidth={2} />
        </span>
        <StatusBadge status={feature.status} />
      </div>

      <h1 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">{feature.title}</h1>

      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
        {feature.description}
      </p>

      <div className="mt-5 inline-flex rounded-full border border-brand/20 bg-brand-soft px-3.5 py-1.5 font-mono text-[11px] text-brand">
        {feature.pipeline}
      </div>

      <DefectScreeningDemo />
    </div>
  );
}
