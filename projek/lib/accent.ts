export const ACCENT_STYLES = {
  violet: "bg-violet-50 text-violet-600",
  rose: "bg-rose-50 text-rose-600",
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  slate: "bg-slate-100 text-slate-600",
} as const;

export type AccentKey = keyof typeof ACCENT_STYLES;
