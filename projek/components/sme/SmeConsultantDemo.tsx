"use client";

import { useMemo } from "react";
import { DUMMY_SALES } from "@/lib/sme/dummyData";
import { buildDashboardStats } from "@/lib/sme/analytics";
import SalesTrendChart from "@/components/sme/SalesTrendChart";
import DashboardSummaryCards from "@/components/sme/DashboardSummaryCards";
import ProductCards from "@/components/sme/ProductCards";
import AnomalyList from "@/components/sme/AnomalyList";
import InsightCard from "@/components/sme/InsightCard";

export default function SmeConsultantDemo() {
  const stats = useMemo(() => buildDashboardStats(DUMMY_SALES), []);
  // dailyTotals sengaja tidak disertakan — /api/sme-insight hanya menerima
  // ringkasan angka agregat, bukan data harian mentah.
  const { dailyTotals, ...insightSummary } = stats;

  return (
    <div className="mt-10 space-y-6">
      <div className="rounded-2xl border border-line bg-brand-soft/60 px-5 py-4 text-sm text-ink-soft">
        <strong className="text-ink">Tentang demo ini:</strong> analitik tren &amp; deteksi
        anomali di bawah dihitung langsung dari data dummy 60 hari (statistik deskriptif
        sederhana, bukan model forecasting produksi). Narasi insight di kartu paling bawah
        hanya menerima ringkasan angka ini — tidak butuh API key untuk berjalan; kalau{" "}
        <code className="font-mono text-xs">ANTHROPIC_API_KEY</code> diisi di{" "}
        <code className="font-mono text-xs">.env.local</code> (opsional), narasinya
        dihasilkan Claude sungguhan.
      </div>

      <DashboardSummaryCards stats={stats} />

      <SalesTrendChart data={dailyTotals} />

      <div>
        <h2 className="mb-3 text-sm font-semibold text-ink">Performa per Produk</h2>
        <ProductCards products={stats.productSummaries} />
      </div>

      <AnomalyList anomalies={stats.anomalies} />

      <InsightCard summary={insightSummary} />
    </div>
  );
}
