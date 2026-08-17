import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getFeature } from "@/lib/features";
import { ACCENT_STYLES } from "@/lib/accent";
import StatusBadge from "@/components/StatusBadge";
import ChatDemo from "@/components/chat/ChatDemo";

export const metadata = {
  title: "AI Product Intelligence Chatbot — BelanjAI",
};

export default async function ChatbotPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const feature = getFeature("chatbot");
  if (!feature) return null;

  const { q } = await searchParams;

  const Icon = feature.icon;

  return (
    <div className="mx-auto max-w-5xl">
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

      <ChatDemo initialQuery={q} />
    </div>
  );
}
