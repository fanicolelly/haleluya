"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList, Heart, Plus, Settings } from "lucide-react";
import { useUser } from "@/lib/user/UserContext";
import { useOrders } from "@/lib/orders/OrderContext";
import { useShop } from "@/lib/shop/ShopContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import AddressCard from "@/components/profile/AddressCard";
import AddressFormModal from "@/components/profile/AddressFormModal";
import LogoutButton from "@/components/profile/LogoutButton";
import type { SavedAddress } from "@/lib/user/types";

export default function ProfilPage() {
  const { profile, addresses, addAddress, updateAddress, removeAddress, setPrimaryAddress } = useUser();
  const { orders } = useOrders();
  const { wishlist } = useShop();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);

  function openAddModal() {
    setEditingAddress(null);
    setModalOpen(true);
  }

  function openEditModal(address: SavedAddress) {
    setEditingAddress(address);
    setModalOpen(true);
  }

  function handleSubmit(values: Omit<SavedAddress, "id" | "isPrimary">) {
    if (editingAddress) {
      updateAddress(editingAddress.id, values);
    } else {
      addAddress(values);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <ProfileHeader profile={profile} />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/pesanan"
          className="rounded-2xl border border-line bg-card p-5 transition-colors hover:border-brand/40"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ClipboardList size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-xl font-semibold text-ink">{orders.length}</p>
              <p className="text-xs text-ink-soft">Total Pesanan</p>
            </div>
          </div>
        </Link>

        <Link
          href="/wishlist"
          className="rounded-2xl border border-line bg-card p-5 transition-colors hover:border-brand/40"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Heart size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-xl font-semibold text-ink">{wishlist.length}</p>
              <p className="text-xs text-ink-soft">Item Wishlist</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">Alamat Tersimpan</h2>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line px-3.5 py-2 text-xs font-medium text-ink transition-colors hover:border-brand/40 hover:text-brand"
          >
            <Plus size={13} /> Tambah Alamat
          </button>
        </div>

        {addresses.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-line bg-card px-5 py-8 text-center text-sm text-ink-soft">
            Belum ada alamat tersimpan.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={() => openEditModal(address)}
                onDelete={() => removeAddress(address.id)}
                onSetPrimary={() => setPrimaryAddress(address.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
        <Link
          href="/pengaturan"
          className="inline-flex items-center gap-1.5 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-brand/40 hover:text-brand"
        >
          <Settings size={15} /> Pengaturan
        </Link>
        <LogoutButton />
      </div>

      <AddressFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialValue={editingAddress}
      />
    </div>
  );
}
