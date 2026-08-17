import { getProductById } from "@/lib/products/catalog";
import type { Order, OrderItem, OrderStatus, ShippingAddress } from "./types";

const SHIPPING_FEE = 15000;

const DEFAULT_ADDRESS: ShippingAddress = {
  recipientName: "Pengguna Demo",
  phone: "0812-3456-7890",
  addressLine: "Jl. Merdeka No. 45, RT 03/RW 05",
  city: "Jakarta Selatan",
  postalCode: "12345",
};

function buildItem(productId: string, quantity: number): OrderItem {
  const product = getProductById(productId);
  if (!product) {
    throw new Error(`Produk dummy pesanan tidak ditemukan: ${productId}`);
  }
  return {
    productId,
    name: product.name,
    price: product.price,
    quantity,
    category: product.category,
  };
}

function buildOrder(
  id: string,
  date: string,
  status: OrderStatus,
  itemDefs: [string, number][],
  address: ShippingAddress = DEFAULT_ADDRESS,
): Order {
  const items = itemDefs.map(([productId, quantity]) => buildItem(productId, quantity));
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    id,
    date,
    items,
    status,
    subtotal,
    shippingFee: SHIPPING_FEE,
    total: subtotal + SHIPPING_FEE,
    shippingAddress: address,
  };
}

// Data pesanan dummy — mencakup keempat status supaya tab filter di
// /pesanan langsung terisi. Referensi produk (productId) diambil dari
// katalog nyata (data/products.json) lewat getProductById, bukan angka
// karangan terpisah.
export const DUMMY_ORDERS: Order[] = [
  buildOrder("ORD-20260628-001", "2026-06-28", "dibatalkan", [["p11", 1]]),
  buildOrder("ORD-20260715-001", "2026-07-15", "selesai", [
    ["p01", 1],
    ["p08", 1],
  ]),
  buildOrder("ORD-20260722-001", "2026-07-22", "selesai", [["p06", 1]]),
  buildOrder("ORD-20260801-001", "2026-08-01", "dikirim", [
    ["p04", 2],
    ["p36", 1],
    ["p10", 1],
  ]),
  buildOrder("ORD-20260804-001", "2026-08-04", "diproses", [["p30", 1]]),
  buildOrder("ORD-20260805-001", "2026-08-05", "diproses", [
    ["p17", 1],
    ["p18", 1],
  ]),
];

export { DEFAULT_ADDRESS };
