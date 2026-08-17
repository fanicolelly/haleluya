import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ProjectionResult } from "@/lib/finance/types";
import { rupiah, formatShortDate } from "@/lib/finance/format";

export default function BudgetAlert({ projection }: { projection: ProjectionResult }) {
  if (projection.willExceedBudget) {
    return (
      <div
        role="alert"
        className="flex gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4"
      >
        <AlertTriangle size={20} className="mt-0.5 shrink-0 text-rose-600" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-rose-700">
            Proyeksi melebihi anggaran bulan ini
          </p>
          <p className="mt-1 text-sm leading-relaxed text-rose-700/90">
            Dengan laju belanja terkini (bobot lebih besar ke hari-hari terakhir), pengeluaran
            diproyeksikan mencapai {rupiah(projection.smoothedProjectedTotal)} (
            {projection.smoothedProjectedPercent.toFixed(0)}% dari anggaran) di akhir bulan.
            {projection.projectedExhaustDate && (
              <> Anggaran diperkirakan habis sekitar tanggal {formatShortDate(projection.projectedExhaustDate)}.</>
            )}{" "}
            Coba kurangi pengeluaran non-esensial di {projection.daysRemaining} hari tersisa.
          </p>
        </div>
      </div>
    );
  }

  if (projection.earlyWarning) {
    return (
      <div
        role="alert"
        className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4"
      >
        <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-amber-700">
            Peringatan dini: proyeksi mendekati anggaran
          </p>
          <p className="mt-1 text-sm leading-relaxed text-amber-700/90">
            Berdasarkan laju belanja terkini, proyeksi akhir bulan sudah mencapai{" "}
            {projection.smoothedProjectedPercent.toFixed(0)}% dari anggaran, meski masih ada{" "}
            {projection.daysRemaining} hari tersisa. Mulai perlambat pengeluaran non-esensial
            sekarang supaya tidak melewati anggaran.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
      <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-emerald-700">Laju belanja masih aman</p>
        <p className="mt-1 text-sm leading-relaxed text-emerald-700/90">
          Proyeksi akhir bulan ({projection.smoothedProjectedPercent.toFixed(0)}% dari anggaran)
          masih di bawah ambang peringatan 90%.
        </p>
      </div>
    </div>
  );
}
