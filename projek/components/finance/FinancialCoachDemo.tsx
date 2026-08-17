"use client";

import { useMemo, useRef, useState } from "react";
import type { Transaction } from "@/lib/finance/types";
import { DEFAULT_BUDGET, DEFAULT_TRANSACTIONS, DEMO_TODAY } from "@/lib/finance/dummyData";
import { computeProjection, buildDailyChartData, buildCategoryBreakdown } from "@/lib/finance/projection";
import BudgetAlert from "@/components/finance/BudgetAlert";
import BudgetSummaryCards from "@/components/finance/BudgetSummaryCards";
import SpendingChart from "@/components/finance/SpendingChart";
import CategoryChart from "@/components/finance/CategoryChart";
import BudgetForm from "@/components/finance/BudgetForm";

export default function FinancialCoachDemo() {
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [transactions, setTransactions] = useState<Transaction[]>(DEFAULT_TRANSACTIONS);
  const idCounter = useRef(DEFAULT_TRANSACTIONS.length);

  const projection = useMemo(
    () => computeProjection(transactions, budget, DEMO_TODAY),
    [transactions, budget],
  );
  const dailyChart = useMemo(
    () => buildDailyChartData(transactions, budget, DEMO_TODAY, projection),
    [transactions, budget, projection],
  );
  const categoryBreakdown = useMemo(() => buildCategoryBreakdown(transactions), [transactions]);

  function addTransaction(tx: { date: string; category: string; amount: number }) {
    idCounter.current += 1;
    setTransactions((prev) => [...prev, { id: `t${idCounter.current}`, ...tx }]);
  }

  function deleteTransaction(id: string) {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }

  return (
    <div className="mt-10 space-y-6">
      <div className="rounded-2xl border border-line bg-brand-soft/60 px-5 py-4 text-sm text-ink-soft">
        <strong className="text-ink">Tentang demo ini:</strong> proyeksi memakai rule-based
        budget engine + simple exponential smoothing (alpha=0.3) di atas data transaksi di
        bawah, bukan model time-series produksi. &ldquo;Hari ini&rdquo; untuk demo ini
        di-set tetap ke {DEMO_TODAY} supaya ada sisa hari untuk diproyeksikan. Semua
        angka dihitung ulang otomatis kalau Anda ubah anggaran atau transaksi.
      </div>

      <BudgetAlert projection={projection} />
      <BudgetSummaryCards projection={projection} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <SpendingChart data={dailyChart} budget={budget} />
        <CategoryChart data={categoryBreakdown} />
      </div>

      <BudgetForm
        budget={budget}
        onBudgetChange={setBudget}
        transactions={transactions}
        onAddTransaction={addTransaction}
        onDeleteTransaction={deleteTransaction}
        today={DEMO_TODAY}
      />
    </div>
  );
}
