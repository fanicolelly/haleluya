"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "@/components/ui/Modal";

const CONFIRM_WORD = "HAPUS";

export default function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  function handleClose() {
    setOpen(false);
    setConfirmText("");
  }

  function handleDelete() {
    // Tidak ada backend/autentikasi sungguhan di proyek ini — "hapus akun"
    // disimulasikan dengan mengosongkan semua data demo yang tersimpan di
    // localStorage (profil, alamat, cart, wishlist, pesanan, pengaturan),
    // lalu kembali ke beranda seolah mulai dari sesi baru.
    window.localStorage.clear();
    window.location.href = "/";
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
      >
        Hapus Akun
      </button>

      <Modal open={open} onClose={handleClose} title="Hapus akun?">
        <div className="flex gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-600" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-rose-700">
            Tindakan ini akan menghapus seluruh data demo Anda (profil, alamat, keranjang,
            wishlist, riwayat pesanan, dan pengaturan) secara permanen dan tidak bisa
            dibatalkan.
          </p>
        </div>

        <label className="mt-4 block text-xs">
          <span className="font-medium text-ink-soft">
            Ketik <span className="font-mono font-semibold text-ink">{CONFIRM_WORD}</span> untuk
            konfirmasi
          </span>
          <input
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-rose-400 focus:outline-none"
          />
        </label>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-line px-4 py-2 text-xs font-medium text-ink-soft hover:text-ink"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={confirmText !== CONFIRM_WORD}
            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Hapus Akun Permanen
          </button>
        </div>
      </Modal>
    </>
  );
}
