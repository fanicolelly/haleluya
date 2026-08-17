"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import type { DailyChartPoint } from "@/lib/finance/types";
import { rupiah, compactRupiah } from "@/lib/finance/format";

const COLORS = {
  actual: "#4F46E5",
  projected: "#F59E0B",
  pace: "#9CA3AF",
  budget: "#E11D48",
};

interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: { dataKey: string; name: string; value: number | null; color: string }[];
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-line bg-card px-3 py-2 text-xs shadow-sm">
      <p className="font-mono font-semibold text-ink">Hari ke-{label}</p>
      {payload
        .filter((entry) => entry.value !== null && entry.value !== undefined)
        .map((entry) => (
          <p key={entry.dataKey} style={{ color: entry.color }}>
            {entry.name}: {rupiah(entry.value as number)}
          </p>
        ))}
    </div>
  );
}

export default function SpendingChart({
  data,
  budget,
}: {
  data: DailyChartPoint[];
  budget: number;
}) {
  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <h3 className="text-sm font-semibold text-ink">Aktual vs Proyeksi vs Anggaran</h3>
      <p className="mt-1 text-xs leading-relaxed text-ink-soft">
        Garis ungu solid = pengeluaran kumulatif aktual, putus-putus oranye = proyeksi
        (exponential smoothing), titik-titik abu = laju rata jika belanja merata sepanjang
        bulan, garis merah putus-putus = batas anggaran.
      </p>

      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "#6B7280" }}
              axisLine={{ stroke: "#E5E7EB" }}
              tickLine={false}
              label={{ value: "Hari ke-", position: "insideBottom", offset: -2, fontSize: 10, fill: "#6B7280" }}
            />
            <YAxis
              tickFormatter={(value: number) => compactRupiah(value)}
              tick={{ fontSize: 11, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine
              y={budget}
              stroke={COLORS.budget}
              strokeDasharray="4 4"
              label={{ value: "Anggaran", position: "insideTopRight", fontSize: 10, fill: COLORS.budget }}
            />
            <Line
              type="monotone"
              dataKey="pace"
              name="Laju rata"
              stroke={COLORS.pace}
              strokeWidth={1.5}
              strokeDasharray="2 3"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="actual"
              name="Aktual"
              stroke={COLORS.actual}
              strokeWidth={2.5}
              dot={false}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="projected"
              name="Proyeksi"
              stroke={COLORS.projected}
              strokeWidth={2.5}
              strokeDasharray="6 4"
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
