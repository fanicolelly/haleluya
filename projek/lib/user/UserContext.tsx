"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_ADDRESSES, DEFAULT_PROFILE } from "./dummyData";
import type { SavedAddress, UserProfile } from "./types";
import { useToast } from "@/lib/toast/ToastContext";

type AddressInput = Omit<SavedAddress, "id" | "isPrimary">;

interface UserContextValue {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>, silent?: boolean) => void;
  addresses: SavedAddress[];
  addAddress: (address: AddressInput) => void;
  updateAddress: (id: string, updates: AddressInput) => void;
  removeAddress: (id: string) => void;
  setPrimaryAddress: (id: string) => void;
  // true setelah hidrasi localStorage selesai. Komponen yang menyalin
  // `profile`/`addresses` ke local state lewat useState(...) HARUS menunggu
  // ini true dulu sebelum mount form-nya — kalau tidak, initial value form
  // akan "kebalap" nilai default sebelum localStorage sempat dibaca.
  hydrated: boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

const PROFILE_STORAGE_KEY = "belanjai:profile";
const ADDRESSES_STORAGE_KEY = "belanjai:addresses";

// Global profil + alamat tersimpan — persist ke localStorage dengan key
// terpisah dari cart/wishlist/orders. Dipasang di app/layout.tsx (di dalam
// ToastProvider, karena beberapa aksi di sini memicu toast).
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [addresses, setAddresses] = useState<SavedAddress[]>(DEFAULT_ADDRESSES);
  const [hydrated, setHydrated] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const savedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) setProfile(JSON.parse(savedProfile));
      const savedAddresses = window.localStorage.getItem(ADDRESSES_STORAGE_KEY);
      if (savedAddresses) setAddresses(JSON.parse(savedAddresses));
    } catch {
      // localStorage tidak tersedia atau datanya korup — pakai data dummy.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }, [profile, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses, hydrated]);

  const updateProfile = useCallback(
    (updates: Partial<UserProfile>, silent = false) => {
      setProfile((prev) => ({ ...prev, ...updates }));
      // silent=true dipakai oleh halaman /pengaturan (mis. ubah email) yang
      // mau menampilkan toast "Pengaturan disimpan" sendiri, bukan pesan
      // toast profil default di bawah ini — supaya tidak dobel toast.
      if (!silent) showToast("Profil berhasil diperbarui", "success");
    },
    [showToast],
  );

  const addAddress = useCallback(
    (address: AddressInput) => {
      setAddresses((prev) => {
        const isFirst = prev.length === 0;
        const newAddress: SavedAddress = { ...address, id: `addr-${Date.now()}`, isPrimary: isFirst };
        return [...prev, newAddress];
      });
      showToast("Alamat baru berhasil ditambahkan", "success");
    },
    [showToast],
  );

  const updateAddress = useCallback(
    (id: string, updates: AddressInput) => {
      setAddresses((prev) => prev.map((address) => (address.id === id ? { ...address, ...updates } : address)));
      showToast("Alamat berhasil diperbarui", "success");
    },
    [showToast],
  );

  const removeAddress = useCallback(
    (id: string) => {
      setAddresses((prev) => {
        const filtered = prev.filter((address) => address.id !== id);
        // Kalau yang dihapus adalah alamat utama, jadikan alamat pertama
        // yang tersisa sebagai alamat utama supaya selalu ada satu utama.
        if (filtered.length > 0 && !filtered.some((address) => address.isPrimary)) {
          filtered[0] = { ...filtered[0], isPrimary: true };
        }
        return filtered;
      });
      showToast("Alamat berhasil dihapus", "info");
    },
    [showToast],
  );

  const setPrimaryAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.map((address) => ({ ...address, isPrimary: address.id === id })));
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({
      profile,
      updateProfile,
      addresses,
      addAddress,
      updateAddress,
      removeAddress,
      setPrimaryAddress,
      hydrated,
    }),
    [
      profile,
      updateProfile,
      addresses,
      addAddress,
      updateAddress,
      removeAddress,
      setPrimaryAddress,
      hydrated,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser harus dipakai di dalam <UserProvider>");
  }
  return context;
}
