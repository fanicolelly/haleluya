"use client";

import { useSettings } from "@/lib/settings/SettingsContext";

export default function RegionSection() {
  const { settings, updateRegion } = useSettings();

  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <h2 className="text-sm font-semibold text-ink">Bahasa & Wilayah</h2>

      <div className="mt-4 max-w-sm space-y-4">
        <label className="block text-xs">
          <span className="font-medium text-ink-soft">Bahasa</span>
          <select
            value={settings.region.language}
            onChange={(event) => updateRegion({ language: event.target.value as "id" | "en" })}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
          >
            <option value="id">Indonesia</option>
            <option value="en" disabled>
              English (segera hadir)
            </option>
          </select>
        </label>

        <label className="block text-xs">
          <span className="font-medium text-ink-soft">Mata Uang</span>
          <select
            value={settings.region.currency}
            onChange={(event) => updateRegion({ currency: event.target.value as "IDR" | "USD" })}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
          >
            <option value="IDR">IDR (Rupiah)</option>
            <option value="USD" disabled>
              USD (segera hadir)
            </option>
          </select>
        </label>
      </div>
    </div>
  );
}
