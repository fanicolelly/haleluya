import type { ShippingAddress } from "@/lib/orders/types";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  photoUrl: string | null; // data URL hasil upload lokal, atau null (pakai inisial)
  joinedDate: string; // ISO date
}

// Extends ShippingAddress (lib/orders/types.ts) supaya strukturnya taken
// terjamin konsisten dengan alamat yang dipakai di flow checkout/pesanan —
// alamat tersimpan tinggal dioper langsung sebagai ShippingAddress saat
// nanti dihubungkan ke /checkout.
export interface SavedAddress extends ShippingAddress {
  id: string;
  label: string; // mis. "Rumah", "Kantor"
  isPrimary: boolean;
}
