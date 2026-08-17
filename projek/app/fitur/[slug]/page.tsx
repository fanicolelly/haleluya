import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { features, getFeature } from "@/lib/features";
import { ACCENT_STYLES } from "@/lib/accent";
import StatusBadge from "@/components/StatusBadge";
import ComingSoon from "@/components/ComingSoon";

export function generateStaticParams() {
  // Fitur berstatus "live" punya halaman khusus di app/fitur/<slug>/page.tsx
  // (mis. app/fitur/accessibility/page.tsx), jadi dikecualikan di sini agar
  // tidak bentrok dengan path statis yang sama saat build.
  return features.filter((feature) => feature.status !== "live").map((feature) => ({ slug: feature.slug }));
}

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const feature = getFeature(slug);

  if (!feature) {
    notFound();
  }

  const Icon = feature.icon;

  return (
    <div className="mx-auto max-w-3xl">
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

      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
        {feature.description}
      </p>

      <div className="mt-5 inline-flex rounded-full border border-brand/20 bg-brand-soft px-3.5 py-1.5 font-mono text-[11px] text-brand">
        {feature.pipeline}
      </div>

      <div className="mt-10">
        <ComingSoon
          title="Segera hadir"
          description="Modul ini sedang dalam pengembangan dan akan dibangun di sesi berikutnya. Halaman ini adalah placeholder navigasi untuk fondasi BelanjAI."
        />
      </div>
    </div>
  );
}
