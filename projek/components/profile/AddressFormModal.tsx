"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import type { SavedAddress } from "@/lib/user/types";

type AddressFormValues = Omit<SavedAddress, "id" | "isPrimary">;

const EMPTY_FORM: AddressFormValues = {
  label: "",
  recipientName: "",
  phone: "",
  addressLine: "",
  city: "",
  postalCode: "",
};

export default function AddressFormModal({
  open,
  onClose,
  onSubmit,
  initialValue,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddressFormValues) => void;
  initialValue?: SavedAddress | null;
}) {
  const [form, setForm] = useState<AddressFormValues>(EMPTY_FORM);

  useEffect(() => {
    if (!open) return;
    setForm(
      initialValue
        ? {
            label: initialValue.label,
            recipientName: initialValue.recipientName,
            phone: initialValue.phone,
            addressLine: initialValue.addressLine,
            city: initialValue.city,
            postalCode: initialValue.postalCode,
          }
        : EMPTY_FORM,
    );
  }, [open, initialValue]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit(form);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={initialValue ? "Ubah Alamat" : "Tambah Alamat Baru"}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-xs">
          <span className="font-medium text-ink-soft">Label</span>
          <input
            required
            placeholder="mis. Rumah, Kantor"
            value={form.label}
            onChange={(event) => setForm((prev) => ({ ...prev, label: event.target.value }))}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
          />
        </label>
        <label className="block text-xs">
          <span className="font-medium text-ink-soft">Nama Penerima</span>
          <input
            required
            value={form.recipientName}
            onChange={(event) => setForm((prev) => ({ ...prev, recipientName: event.target.value }))}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
          />
        </label>
        <label className="block text-xs">
          <span className="font-medium text-ink-soft">Nomor Telepon</span>
          <input
            required
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
          />
        </label>
        <label className="block text-xs">
          <span className="font-medium text-ink-soft">Alamat Lengkap</span>
          <textarea
            required
            rows={2}
            value={form.addressLine}
            onChange={(event) => setForm((prev) => ({ ...prev, addressLine: event.target.value }))}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs">
            <span className="font-medium text-ink-soft">Kota</span>
            <input
              required
              value={form.city}
              onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
            />
          </label>
          <label className="block text-xs">
            <span className="font-medium text-ink-soft">Kode Pos</span>
            <input
              required
              value={form.postalCode}
              onChange={(event) => setForm((prev) => ({ ...prev, postalCode: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
            />
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line px-4 py-2 text-xs font-medium text-ink-soft hover:text-ink"
          >
            Batal
          </button>
          <button
            type="submit"
            className="rounded-xl bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand-dark"
          >
            Simpan
          </button>
        </div>
      </form>
    </Modal>
  );
}
