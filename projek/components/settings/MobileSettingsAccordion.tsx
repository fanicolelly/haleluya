"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SettingsTabConfig {
  key: string;
  label: string;
  icon: LucideIcon;
  component: React.ComponentType;
}

export default function MobileSettingsAccordion({ tabs }: { tabs: SettingsTabConfig[] }) {
  const [openKey, setOpenKey] = useState(tabs[0]?.key ?? "");

  return (
    <div className="space-y-3 lg:hidden">
      {tabs.map(({ key, label, icon: Icon, component: Content }) => {
        const open = openKey === key;
        return (
          <div key={key} className="overflow-hidden rounded-2xl border border-line bg-card">
            <button
              type="button"
              onClick={() => setOpenKey(open ? "" : key)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-sm font-medium text-ink"
            >
              <span className="flex items-center gap-2.5">
                <Icon size={16} aria-hidden="true" className="text-brand" />
                {label}
              </span>
              <ChevronDown
                size={16}
                aria-hidden="true"
                className={`shrink-0 text-ink-soft transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
            {open && (
              <div className="border-t border-line px-4 py-4">
                <Content />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
