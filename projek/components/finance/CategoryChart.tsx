"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { CategoryBreakdown } from "@/lib/finance/types";
import { rupiah, compactRupiah } from "@/lib/finance/format";

interface ChartTooltipProps {
  active?: boolean;
  payload?: { payload: CategoryBreakdown }[];
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0].payload;

  return (
    <div className="rounded-lg border border-line bg-card px-3 py-2 text-xs shadow-sm">
      <p className="font-mono font-semibold text-ink">{item.category}</p>
      <p className="mt-0.5 text-ink-soft">
        {rupiah(item.total)} · {item.percent.toFixed(1)}%
      </p>
    </div>
  );
}

export default function CategoryChart({ data }: { data: CategoryBreakdown[] }) {
  const chartHeight = Math.max(180, data.length * 44);

  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <h3 className="text-sm font-semibold text-ink">Breakdown per Kategori</h3>
      <p className="mt-1 text-xs text-ink-soft">Total pengeluaran bulan ini, dikelompokkan per kategori.</p>

      <div className="mt-4 w-full" style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(value: number) => compactRupiah(value)}
              tick={{ fontSize: 11, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="category"
              tick={{ fontSize: 11, fill: "#16181D" }}
              axisLine={false}
              tickLine={false}
              width={110}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "#F7F7FB" }} />
            <Bar dataKey="total" fill="#4F46E5" radius={[0, 6, 6, 0]} maxBarSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
