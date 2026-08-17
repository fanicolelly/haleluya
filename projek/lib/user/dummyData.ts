import type { UserProfile, SavedAddress } from "./types";

export const DEFAULT_PROFILE: UserProfile = {
  name: "Pengguna Demo",
  email: "pengguna.demo@belanjai.id",
  phone: "0812-3456-7890",
  photoUrl: null,
  joinedDate: "2026-01-15",
};

// Alamat "Rumah" sengaja sama persis dengan alamat default di /checkout —
// merepresentasikan pengguna demo yang sama.
export const DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: "addr-1",
    label: "Rumah",
    recipientName: "Pengguna Demo",
    phone: "0812-3456-7890",
    addressLine: "Jl. Merdeka No. 45, RT 03/RW 05",
    city: "Jakarta Selatan",
    postalCode: "12345",
    isPrimary: true,
  },
  {
    id: "addr-2",
    label: "Kantor",
    recipientName: "Pengguna Demo",
    phone: "0812-3456-7890",
    addressLine: "Gedung Menara Sudirman Lt. 12, Jl. Jend. Sudirman Kav. 60",
    city: "Jakarta Selatan",
    postalCode: "12190",
    isPrimary: false,
  },
];
