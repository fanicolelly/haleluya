"use client";

import { useState } from "react";
import { PenLine } from "lucide-react";
import Modal from "@/components/ui/Modal";

export default function ReviewModalButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-brand/40 hover:text-brand"
      >
        Tulis Ulasan
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Tulis Ulasan">
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <PenLine size={28} className="text-ink-soft/50" aria-hidden="true" />
          <p className="text-sm font-medium text-ink">Fitur tulis ulasan segera hadir</p>
          <p className="text-xs leading-relaxed text-ink-soft">
            Kami sedang menyiapkan fitur ini agar Anda bisa berbagi pengalaman belanja untuk
            pesanan ini.
          </p>
        </div>
      </Modal>
    </>
  );
}
