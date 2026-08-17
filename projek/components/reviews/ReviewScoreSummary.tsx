import type { ReviewScore, Verdict } from "@/lib/reviews/types";

const SUMMARY_ITEMS: { key: Verdict; label: string; classes: string }[] = [
  { key: "asli", label: "Asli", classes: "bg-emerald-50 text-emerald-700" },
  { key: "tinjau", label: "Perlu Ditinjau", classes: "bg-amber-50 text-amber-700" },
  { key: "mencurigakan", label: "Mencurigakan", classes: "bg-rose-50 text-rose-700" },
];

export default function ReviewScoreSummary({ scores }: { scores: ReviewScore[] }) {
  const counts: Record<Verdict, number> = { asli: 0, tinjau: 0, mencurigakan: 0 };
  scores.forEach((score) => {
    counts[score.verdict] += 1;
  });

  return (
    <div className="grid grid-cols-3 gap-3">
      {SUMMARY_ITEMS.map((item) => (
        <div key={item.key} className={`rounded-xl px-4 py-3 text-center ${item.classes}`}>
          <p className="font-mono text-2xl font-semibold">{counts[item.key]}</p>
          <p className="mt-0.5 text-xs font-medium">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
