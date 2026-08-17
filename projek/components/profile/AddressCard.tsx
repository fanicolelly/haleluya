import { MapPin, Pencil, Star, Trash2 } from "lucide-react";
import type { SavedAddress } from "@/lib/user/types";

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetPrimary,
}: {
  address: SavedAddress;
  onEdit: () => void;
  onDelete: () => void;
  onSetPrimary: () => void;
}) {
  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
            <MapPin size={15} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">{address.label}</p>
            {address.isPrimary && (
              <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[9.5px] text-emerald-700">
                <Star size={9} className="fill-emerald-600" aria-hidden="true" /> Alamat Utama
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Ubah alamat ${address.label}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-soft hover:text-brand"
          >
            <Pencil size={13} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Hapus alamat ${address.label}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-soft hover:text-rose-600"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="mt-3 text-xs leading-relaxed text-ink-soft">
        <p className="font-medium text-ink">{address.recipientName}</p>
        <p>{address.phone}</p>
        <p className="mt-1">{address.addressLine}</p>
        <p>
          {address.city}, {address.postalCode}
        </p>
      </div>

      {!address.isPrimary && (
        <button
          type="button"
          onClick={onSetPrimary}
          className="mt-3 text-xs font-medium text-brand hover:underline"
        >
          Jadikan alamat utama
        </button>
      )}
    </div>
  );
}
