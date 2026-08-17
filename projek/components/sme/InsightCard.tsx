"use client";

import { useEffect, useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import type { InsightSummary } from "@/lib/sme/types";

export default function InsightCard({ summary }: { summary: InsightSummary }) {
  const [insight, setInsight] = useState<string | null>(null);
  const [mode, setMode] = useState<"llm" | "template" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateInsight() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/sme-insight", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ summary }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Gagal menghasilkan insight.");
      }

      setInsight(data.insight);
      setMode(data.mode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghasilkan insight.");
    } finally {
      setLoading(false);
    }
  }

  // Generate otomatis sekali saat halaman dibuka, supaya juri langsung
  // melihat hasilnya tanpa perlu klik dulu.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    generateInsight();
  }, []);

  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
            <Sparkles size={16} />
          </span>
          <h3 className="text-sm font-semibold text-ink">Insight &amp; Rekomendasi AI</h3>
          {mode && (
            <span
              className={
                "rounded-full px-2 py-0.5 font-mono text-[9.5px] tracking-wide " +
                (mode === "llm" ? "bg-brand text-white" : "border border-line bg-paper text-ink-soft")
              }
            >
              {mode === "llm" ? "CLAUDE" : "TEMPLATE"}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={generateInsight}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-3.5 py-2 text-xs font-medium text-white hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          {loading ? "Menyusun insight..." : "Generate insight baru"}
        </button>
      </div>

      <div role="status" aria-live="polite" className="mt-4">
        {loading && !insight && (
          <p className="text-sm italic text-ink-soft">Menganalisis data penjualan...</p>
        )}
        {error && <p className="text-sm text-rose-600">⚠️ {error}</p>}
        {insight && (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">{insight}</p>
        )}
      </div>
    </div>
  );
}
