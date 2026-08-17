"use client";

import { useState } from "react";
import { ChevronDown, Star, CircleCheck, AlertTriangle } from "lucide-react";
import type { Review, ReviewScore, Verdict } from "@/lib/reviews/types";

const VERDICT_META: Record<Verdict, { label: string; badge: string; bar: string }> = {
  asli: {
    label: "Asli",
    badge: "border border-emerald-200 bg-emerald-50 text-emerald-700",
    bar: "bg-emerald-500",
  },
  tinjau: {
    label: "Perlu Ditinjau",
    badge: "border border-amber-200 bg-amber-50 text-amber-700",
    bar: "bg-amber-500",
  },
  mencurigakan: {
    label: "Mencurigakan",
    badge: "border border-rose-200 bg-rose-50 text-rose-700",
    bar: "bg-rose-500",
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Komponen reusable: hanya butuh sepasang `review` (data mentah) + `score`
// (hasil lib/reviews/scoring.ts). Tidak bergantung pada data dummy sama
// sekali, jadi tinggal dipasok data ulasan asli + scoreReviews() untuk
// dipakai di tempat lain.
export default function ReviewCard({ review, score }: { review: Review; score: ReviewScore }) {
  const [expanded, setExpanded] = useState(false);
  const meta = VERDICT_META[score.verdict];

  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">{review.reviewerName}</p>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-line"}
                />
              ))}
            </div>
            <span className="sr-only">{review.rating} dari 5 bintang</span>
            <span className="font-mono text-xs text-ink-soft">{formatDate(review.postedAt)}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className={`rounded-full px-3 py-1 font-mono text-[10.5px] ${meta.badge}`}>
            {meta.label}
          </span>
          <span className="font-mono text-xs text-ink-soft">
            {score.authenticityScore}% kemungkinan asli
          </span>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink">{review.text}</p>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div
          className={`h-full rounded-full ${meta.bar}`}
          style={{ width: `${score.authenticityScore}%` }}
        />
      </div>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        aria-controls={`factors-${review.id}`}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-brand"
      >
        <ChevronDown size={14} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
        {expanded ? "Sembunyikan analisis" : "Lihat breakdown faktor"}
      </button>

      {expanded && (
        <ul id={`factors-${review.id}`} className="mt-3 space-y-2.5 border-t border-line pt-3">
          {score.factors.map((factor) => (
            <li key={factor.id} className="flex gap-2.5">
              {factor.triggered ? (
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-500" aria-hidden="true" />
              ) : (
                <CircleCheck size={16} className="mt-0.5 shrink-0 text-emerald-500" aria-hidden="true" />
              )}
              <div>
                <p className="text-xs font-semibold text-ink">
                  {factor.label}
                  {factor.triggered && (
                    <span className="ml-1.5 font-mono text-[10.5px] font-normal text-rose-500">
                      -{factor.weight}
                    </span>
                  )}
                </p>
                <p className="text-xs leading-relaxed text-ink-soft">{factor.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
