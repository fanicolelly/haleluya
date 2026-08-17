"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProductById } from "@/lib/products/catalog";
import { useToast } from "@/lib/toast/ToastContext";

export interface CartItem {
  productId: string;
  quantity: number;
}

interface ShopContextValue {
  cart: CartItem[];
  cartCount: number;
  addToCart: (productId: string, quantity: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  wishlist: string[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

const CART_STORAGE_KEY = "belanjai:cart";
const WISHLIST_STORAGE_KEY = "belanjai:wishlist";

// Global cart/wishlist store — persist ke localStorage supaya isinya tidak
// hilang saat refresh. Provider dipasang global di app/layout.tsx (di dalam
// ToastProvider, karena addToCart/removeFromCart memicu toast).
export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { showToast } = useToast();

  // Hidrasi dari localStorage sekali saat mount — SENGAJA bukan saat render
  // pertama, supaya HTML dari server & render pertama di client tetap sama
  // persis (menghindari hydration mismatch React). Efek sampingnya: kalau
  // ada isi keranjang tersimpan, akan muncul sesaat setelah mount, bukan
  // langsung di render pertama.
  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) setCart(JSON.parse(savedCart));
      const savedWishlist = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch {
      // localStorage tidak tersedia atau datanya korup — mulai dari kosong.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const addToCart = useCallback(
    (productId: string, quantity: number) => {
      setCart((prev) => {
        const existing = prev.find((item) => item.productId === productId);
        if (existing) {
          return prev.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
          );
        }
        return [...prev, { productId, quantity }];
      });

      const product = getProductById(productId);
      showToast(`${quantity}x ${product?.name ?? "Produk"} ditambahkan ke keranjang`, "success");
    },
    [showToast],
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      const product = getProductById(productId);
      setCart((prev) => prev.filter((item) => item.productId !== productId));
      showToast(`${product?.name ?? "Produk"} dihapus dari keranjang`, "info");
    },
    [showToast],
  );

  const updateCartQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      setCart((prev) =>
        prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
      );
    },
    [removeFromCart],
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  }, []);

  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const value = useMemo<ShopContextValue>(
    () => ({
      cart,
      cartCount,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      wishlist,
      isInWishlist,
      toggleWishlist,
    }),
    [
      cart,
      cartCount,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      wishlist,
      isInWishlist,
      toggleWishlist,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopContextValue {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop harus dipakai di dalam <ShopProvider>");
  }
  return context;
}
