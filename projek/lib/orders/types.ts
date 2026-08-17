export type OrderStatus = "diproses" | "dikirim" | "selesai" | "dibatalkan";

export interface OrderItem {
  productId: string;
  // Nama, harga, kategori di-snapshot saat pesanan dibuat (bukan diambil
  // ulang dari katalog) — supaya riwayat pesanan tidak berubah kalau harga
  // atau data produk di katalog berubah di kemudian hari.
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export interface ShippingAddress {
  recipientName: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
}

export interface Order {
  id: string;
  date: string; // ISO date
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingAddress: ShippingAddress;
}
