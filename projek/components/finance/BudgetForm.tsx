"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import type { Transaction } from "@/lib/finance/types";
import { rupiah, formatShortDate } from "@/lib/finance/format";

const CATEGORIES = [
  "Makanan & Minuman",
  "Transportasi",
  "Belanja Online",
  "Hiburan",
  "Tagihan",
  "Lainnya",
];

export default function BudgetForm({
  budget,
  onBudgetChange,
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  today,
}: {
  budget: number;
  onBudgetChange: (value: number) => void;
  transactions: Transaction[];
  onAddTransaction: (tx: { date: string; category: string; amount: number }) => void;
  onDeleteTransaction: (id: string) => void;
  today: string;
}) {
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!date || !category || !parsedAmount || parsedAmount <= 0) return;

    onAddTransaction({ date, category, amount: parsedAmount });
    setAmount("");
  }

  const sortedTransactions = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <h3 className="text-sm font-semibold text-ink">Anggaran & Transaksi</h3>

      <label htmlFor="monthly-budget" className="mt-4 block text-xs font-medium text-ink-soft">
        Anggaran bulanan
      </label>
      <div className="mt-1.5 flex items-center gap-2">
        <span className="font-mono text-sm text-ink-soft">Rp</span>
        <input
          id="monthly-budget"
          type="number"
          min={0}
          step={10000}
          value={budget}
          onChange={(event) => onBudgetChange(Number(event.target.value) || 0)}
          className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
        />
      </div>

      <form onSubmit={handleSubmit} className="mt-5 border-t border-line pt-4">
        <p className="text-xs font-medium text-ink-soft">Tambah transaksi</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            aria-label="Tanggal transaksi"
            className="col-span-1 rounded-xl border border-line bg-paper px-2.5 py-2 text-xs text-ink focus:border-brand focus:outline-none sm:col-span-1"
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Kategori transaksi"
            className="col-span-1 rounded-xl border border-line bg-paper px-2.5 py-2 text-xs text-ink focus:border-brand focus:outline-none"
          >
            {CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={0}
            step={1000}
            placeholder="Nominal (Rp)"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            aria-label="Nominal transaksi"
            className="col-span-1 rounded-xl border border-line bg-paper px-2.5 py-2 text-xs text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none"
          />
          <button
            type="submit"
            className="col-span-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink px-3 py-2 text-xs font-medium text-white hover:bg-ink/90"
          >
            <Plus size={14} /> Tambah
          </button>
        </div>
      </form>

      <div className="mt-4 max-h-72 overflow-y-auto border-t border-line pt-3">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-ink-soft">
              <th className="pb-2 font-medium">Tanggal</th>
              <th className="pb-2 font-medium">Kategori</th>
              <th className="pb-2 text-right font-medium">Nominal</th>
              <th className="pb-2" aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((tx) => (
              <tr key={tx.id} className="border-t border-line">
                <td className="py-2 font-mono text-ink-soft">{formatShortDate(tx.date)}</td>
                <td className="py-2 text-ink">{tx.category}</td>
                <td className="py-2 text-right font-mono text-ink">{rupiah(tx.amount)}</td>
                <td className="py-2 pl-2 text-right">
                  <button
                    type="button"
                    onClick={() => onDeleteTransaction(tx.id)}
                    aria-label={`Hapus transaksi ${tx.category} tanggal ${formatShortDate(tx.date)}`}
                    className="text-ink-soft hover:text-rose-600"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
