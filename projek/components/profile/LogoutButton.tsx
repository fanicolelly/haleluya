"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import Modal from "@/components/ui/Modal";

export default function LogoutButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
      >
        <LogOut size={15} /> Keluar
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Keluar dari akun?">
        <p className="text-sm leading-relaxed text-ink-soft">
          Ini demo — tombol ini tidak benar-benar mengeluarkan Anda dari akun.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl border border-line px-4 py-2 text-xs font-medium text-ink-soft hover:text-ink"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-medium text-white hover:bg-rose-700"
          >
            Ya, Keluar
          </button>
        </div>
      </Modal>
    </>
  );
}
