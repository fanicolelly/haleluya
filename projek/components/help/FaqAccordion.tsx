"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/help/data";

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-card">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-medium text-ink"
            >
              {item.question}
              <ChevronDown
                size={16}
                aria-hidden="true"
                className={`shrink-0 text-ink-soft transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
            {open && (
              <div className="px-5 pb-4 text-sm leading-relaxed text-ink-soft">{item.answer}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
