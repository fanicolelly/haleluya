"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useShop } from "@/lib/shop/ShopContext";
import { useOrders } from "@/lib/orders/OrderContext";
import { useToast } from "@/lib/toast/ToastContext";
import { getProductById } from "@/lib/products/catalog";

function rupiah(amount: number): string {
  return "Rp" + amount.toLocaleString("id-ID");
}

const SHIPPING_FEE = 15000;

export default function CheckoutPage() {
  const { cart, clearCart } = useShop();
  const { createOrder } = useOrders();
  const { showToast } = useToast();
  const router = useRouter();

  const [recipientName, setRecipientName] = useState("Pengguna Demo");
  const [phone, setPhone] = useState("0812-3456-7890");
  const [addressLine, setAddressLine] = useState("Jl. Merdeka No. 45, RT 03/RW 05");
  const [city, setCity] = useState("Jakarta Selatan");
  const [postalCode, setPostalCode] = useState("12345");
  const [submitting, setSubmitting] = useState(false);

  const items = cart
    .map((cartItem) => {
      const product = getProductById(cartItem.productId);
      return product ? { product, quantity: cartItem.quantity } : null;
    })
    .filter(
      (item): item is { product: NonNullable<ReturnType<typeof getProductById>>; quantity: number } =>
        item !== null,
    );

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + SHIPPING_FEE;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <ShoppingBag size={40} className="mx-auto text-ink-soft/50" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-bold text-ink">Keranjang Anda kosong</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Tambahkan produk ke keranjang terlebih dahulu sebelum checkout.
        </p>
        <Link
          href="/kategori"
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          Mulai Belanja
        </Link>
      </div>
    );
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);

    const orderItems = items.map(({ product, quantity }) => ({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      category: product.category,
    }));

    const order = createOrder({
      items: orderItems,
      subtotal,
      shippingFee: SHIPPING_FEE,
      total,
      shippingAddress: { recipientName, phone, addressLine, city, postalCode },
    });

    clearCart();
    showToast("Pesanan berhasil dibuat!", "success");
    router.push(`/pesanan/${order.id}`);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Checkout</h1>
      <p className="mt-1 text-sm text-ink-soft">Lengkapi alamat pengiriman lalu buat pesanan.</p>

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-card p-5">
            <h2 className="text-sm font-semibold text-ink">Alamat Pengiriman</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block text-xs">
                <span className="font-medium text-ink-soft">Nama Penerima</span>
                <input
                  required
                  value={recipientName}
                  onChange={(event) => setRecipientName(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
                />
              </label>
              <label className="block text-xs">
                <span className="font-medium text-ink-soft">Nomor Telepon</span>
                <input
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
                />
              </label>
              <label className="block text-xs sm:col-span-2">
                <span className="font-medium text-ink-soft">Alamat Lengkap</span>
                <input
                  required
                  value={addressLine}
                  onChange={(event) => setAddressLine(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
                />
              </label>
              <label className="block text-xs">
                <span className="font-medium text-ink-soft">Kota</span>
                <input
                  required
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
                />
              </label>
              <label className="block text-xs">
                <span className="font-medium text-ink-soft">Kode Pos</span>
                <input
                  required
                  value={postalCode}
                  onChange={(event) => setPostalCode(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-card p-5">
            <h2 className="text-sm font-semibold text-ink">Item Pesanan</h2>
            <div className="mt-2">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3 border-b border-line py-3 text-sm last:border-b-0"
                >
                  <span className="line-clamp-1 text-ink">
                    {quantity}x {product.name}
                  </span>
                  <span className="shrink-0 font-mono text-ink-soft">
                    {rupiah(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-card p-5 lg:sticky lg:top-20">
          <h2 className="text-sm font-semibold text-ink">Ringkasan Pembayaran</h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd className="font-mono text-ink">{rupiah(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink-soft">Estimasi Ongkir</dt>
              <dd className="font-mono text-ink">{rupiah(SHIPPING_FEE)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-dashed border-line pt-2.5 font-semibold">
              <dt className="text-ink">Total</dt>
              <dd className="font-mono text-ink">{rupiah(total)}</dd>
            </div>
          </dl>
          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full rounded-xl bg-brand px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Memproses..." : "Buat Pesanan"}
          </button>
        </div>
      </form>
    </div>
  );
}
