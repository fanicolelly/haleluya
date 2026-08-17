"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/lib/toast/ToastContext";

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function resetForm() {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // Tidak ada backend sungguhan — pesan hanya disimulasikan terkirim
    // lewat toast konfirmasi, sesuai kebutuhan demo.
    resetForm();
    onClose();
    showToast("Pesan terkirim, tim kami akan merespons dalam 1x24 jam", "success");
  }

  return (
    <Modal open={open} onClose={handleClose} title="Hubungi Kami">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-xs">
          <span className="font-medium text-ink-soft">Nama</span>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
          />
        </label>
        <label className="block text-xs">
          <span className="font-medium text-ink-soft">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
          />
        </label>
        <label className="block text-xs">
          <span className="font-medium text-ink-soft">Subjek</span>
          <input
            required
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
          />
        </label>
        <label className="block text-xs">
          <span className="font-medium text-ink-soft">Pesan</span>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="mt-1 w-full resize-none rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
          />
        </label>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-line px-4 py-2 text-xs font-medium text-ink-soft hover:text-ink"
          >
            Batal
          </button>
          <button
            type="submit"
            className="rounded-xl bg-brand px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-brand-dark"
          >
            Kirim Pesan
          </button>
        </div>
      </form>
    </Modal>
  );
}
