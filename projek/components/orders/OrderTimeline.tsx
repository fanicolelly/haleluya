import { Check } from "lucide-react";
import type { OrderStatus } from "@/lib/orders/types";

const STEPS = [
  { key: "dipesan", label: "Dipesan" },
  { key: "diproses", label: "Diproses" },
  { key: "dikirim", label: "Dikirim" },
  { key: "selesai", label: "Selesai" },
];

function getStepIndex(status: OrderStatus): number {
  switch (status) {
    case "diproses":
      return 1;
    case "dikirim":
      return 2;
    case "selesai":
      return 3;
    default:
      return 0;
  }
}

export default function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "dibatalkan") {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        Pesanan ini telah dibatalkan.
      </div>
    );
  }

  const currentIndex = getStepIndex(status);

  return (
    <div className="flex items-start">
      {STEPS.map((step, index) => {
        const isDone = index <= currentIndex;
        const isLast = index === STEPS.length - 1;

        return (
          <div key={step.key} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold ${
                  isDone ? "border-brand bg-brand text-white" : "border-line bg-card text-ink-soft"
                }`}
              >
                {isDone ? <Check size={13} /> : index + 1}
              </span>
              <span className={`text-[10.5px] font-medium ${isDone ? "text-ink" : "text-ink-soft"}`}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className={`mx-2 h-0.5 flex-1 ${index < currentIndex ? "bg-brand" : "bg-line"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
