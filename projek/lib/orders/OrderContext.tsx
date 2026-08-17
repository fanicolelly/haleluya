"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DUMMY_ORDERS } from "./dummyData";
import type { Order, OrderItem, ShippingAddress } from "./types";
import { useToast } from "@/lib/toast/ToastContext";

interface CreateOrderInput {
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingAddress: ShippingAddress;
}

interface OrderContextValue {
  orders: Order[];
  getOrderById: (id: string) => Order | undefined;
  createOrder: (input: CreateOrderInput) => Order;
  cancelOrder: (id: string) => void;
}

const OrderContext = createContext<OrderContextValue | null>(null);

const ORDER_STORAGE_KEY = "belanjai:orders";

// Dipakai konsisten oleh generateOrderId() & createOrder() di bawah — kalau
// salah satu pakai waktu lokal dan satunya UTC (mis. toISOString()), tanggal
// pesanan bisa beda satu hari dari yang tertulis di ID pesanan.
function getLocalDateParts(date: Date): { y: number; m: string; d: string } {
  return {
    y: date.getFullYear(),
    m: String(date.getMonth() + 1).padStart(2, "0"),
    d: String(date.getDate()).padStart(2, "0"),
  };
}

function generateOrderId(date: Date): string {
  const { y, m, d } = getLocalDateParts(date);
  const suffix = Date.now().toString().slice(-6);
  return `ORD-${y}${m}${d}-${suffix}`;
}

// Global store riwayat pesanan — mulai dari data dummy (DUMMY_ORDERS),
// persist ke localStorage supaya pesanan baru dari checkout tidak hilang
// saat refresh. Dipasang di app/layout.tsx (di dalam ToastProvider, karena
// cancelOrder memicu toast).
export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(DUMMY_ORDERS);
  const [hydrated, setHydrated] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(ORDER_STORAGE_KEY);
      if (saved) setOrders(JSON.parse(saved));
    } catch {
      // localStorage tidak tersedia atau datanya korup — pakai data dummy.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
  }, [orders, hydrated]);

  const getOrderById = useCallback((id: string) => orders.find((order) => order.id === id), [orders]);

  const createOrder = useCallback((input: CreateOrderInput): Order => {
    const now = new Date();
    const { y, m, d } = getLocalDateParts(now);
    const newOrder: Order = {
      id: generateOrderId(now),
      date: `${y}-${m}-${d}`,
      status: "diproses",
      ...input,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const cancelOrder = useCallback(
    (id: string) => {
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, status: "dibatalkan" } : order)),
      );
      showToast("Pesanan berhasil dibatalkan", "info");
    },
    [showToast],
  );

  const value = useMemo<OrderContextValue>(
    () => ({ orders, getOrderById, createOrder, cancelOrder }),
    [orders, getOrderById, createOrder, cancelOrder],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders(): OrderContextValue {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders harus dipakai di dalam <OrderProvider>");
  }
  return context;
}
