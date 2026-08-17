"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useSettings } from "@/lib/settings/SettingsContext";
import type { ThemePreference } from "@/lib/settings/types";

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "terang", label: "Terang", icon: Sun },
  { value: "gelap", label: "Gelap", icon: Moon },
  { value: "sistem", label: "Ikuti Sistem", icon: Monitor },
];

// Proyek ini belum punya implementasi dark mode penuh — token warna di
// app/globals.css masih dirancang untuk mode terang saja. Pilihan tema di
// sini baru berupa UI + penyimpanan preferensi (localStorage lewat
// SettingsContext); penerapan tema gelap ke seluruh aplikasi menyusul.
export default function DisplaySection() {
  const { settings, updateDisplay } = useSettings();

  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <h2 className="text-sm font-semibold text-ink">Tampilan</h2>
      <p className="mt-1 text-xs text-ink-soft">Pilih tema tampilan BelanjAI.</p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
          const active = settings.display.theme === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => updateDisplay({ theme: value })}
              className={`flex flex-col items-center gap-2 rounded-xl border px-4 py-4 text-sm font-medium transition-colors ${
                active
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-line text-ink-soft hover:border-brand/40 hover:text-ink"
              }`}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
