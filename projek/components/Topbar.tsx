import { Menu, Search, Bell } from "lucide-react";

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-white/80 px-5 py-4 backdrop-blur">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Buka menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft hover:bg-paper lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="relative w-full max-w-xl">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
          />
          <input
            type="text"
            placeholder="Cari produk, kategori, atau brand..."
            className="w-full rounded-xl border border-line bg-paper py-2.5 pl-9 pr-10 text-sm text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none"
          />
          <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-soft sm:block">
            /
          </kbd>
        </div>
      </div>

      <button
        type="button"
        className="flex shrink-0 items-center gap-2 text-sm text-ink-soft hover:text-ink"
      >
        <Bell size={18} />
        <span className="hidden sm:inline">Notifikasi</span>
      </button>
    </header>
  );
}
