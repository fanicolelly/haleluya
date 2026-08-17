import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { EvidenceRecord, ConsistencyVerdict } from "@/lib/defect/types";

const VERDICT_META: Record<
  ConsistencyVerdict,
  { label: string; classes: string; bar: string; icon: typeof CheckCircle2 }
> = {
  konsisten: {
    label: "Kondisi Konsisten",
    classes: "border-emerald-200 bg-emerald-50 text-emerald-700",
    bar: "bg-emerald-500",
    icon: CheckCircle2,
  },
  tinjau: {
    label: "Perlu Ditinjau Manual",
    classes: "border-amber-200 bg-amber-50 text-amber-700",
    bar: "bg-amber-500",
    icon: AlertTriangle,
  },
  berubah: {
    label: "Terindikasi Ada Perubahan",
    classes: "border-rose-200 bg-rose-50 text-rose-700",
    bar: "bg-rose-500",
    icon: XCircle,
  },
};

export default function ComparisonResultCard({ evidence }: { evidence: EvidenceRecord }) {
  const meta = VERDICT_META[evidence.verdict];
  const Icon = meta.icon;

  return (
    <div className={`rounded-2xl border p-5 ${meta.classes}`}>
      <div className="flex items-center gap-2.5">
        <Icon size={22} aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold">{meta.label}</p>
          <p className="text-xs opacity-80">
            Skor konsistensi: {evidence.consistencyScore.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/60">
        <div
          className={`h-full rounded-full ${meta.bar}`}
          style={{ width: `${evidence.consistencyScore}%` }}
        />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs">
        <div>
          <dt className="opacity-70">Selisih piksel rata-rata</dt>
          <dd className="mt-0.5 font-semibold">{evidence.pixelDifferencePercent.toFixed(1)}%</dd>
        </div>
        <div>
          <dt className="opacity-70">Jarak hash persepsi</dt>
          <dd className="mt-0.5 font-semibold">
            {evidence.hashHammingDistance} / {evidence.hashTotalBits} bit
          </dd>
        </div>
      </dl>
    </div>
  );
}
