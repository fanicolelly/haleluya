"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_SETTINGS } from "./dummyData";
import type { AppSettings, DisplaySettings, NotificationSettings, PrivacySettings, RegionSettings } from "./types";
import { useToast } from "@/lib/toast/ToastContext";

interface SettingsContextValue {
  settings: AppSettings;
  updateNotifications: (updates: Partial<NotificationSettings>) => void;
  updatePrivacy: (updates: Partial<PrivacySettings>) => void;
  updateDisplay: (updates: Partial<DisplaySettings>) => void;
  updateRegion: (updates: Partial<RegionSettings>) => void;
  hydrated: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);
const SETTINGS_STORAGE_KEY = "belanjai:settings";

// Global pengaturan aplikasi (notifikasi, privasi, tampilan, bahasa &
// wilayah) — persist ke localStorage dengan key sendiri, terpisah dari
// profil/alamat/cart/wishlist/orders. Dipasang di app/layout.tsx (di dalam
// ToastProvider, karena tiap update memicu toast "Pengaturan disimpan").
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) setSettings(JSON.parse(saved));
    } catch {
      // localStorage tidak tersedia atau datanya korup — pakai default.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings, hydrated]);

  const updateNotifications = useCallback(
    (updates: Partial<NotificationSettings>) => {
      setSettings((prev) => ({ ...prev, notifications: { ...prev.notifications, ...updates } }));
      showToast("Pengaturan disimpan", "success");
    },
    [showToast],
  );

  const updatePrivacy = useCallback(
    (updates: Partial<PrivacySettings>) => {
      setSettings((prev) => ({ ...prev, privacy: { ...prev.privacy, ...updates } }));
      showToast("Pengaturan disimpan", "success");
    },
    [showToast],
  );

  const updateDisplay = useCallback(
    (updates: Partial<DisplaySettings>) => {
      setSettings((prev) => ({ ...prev, display: { ...prev.display, ...updates } }));
      showToast("Pengaturan disimpan", "success");
    },
    [showToast],
  );

  const updateRegion = useCallback(
    (updates: Partial<RegionSettings>) => {
      setSettings((prev) => ({ ...prev, region: { ...prev.region, ...updates } }));
      showToast("Pengaturan disimpan", "success");
    },
    [showToast],
  );

  const value = useMemo<SettingsContextValue>(
    () => ({ settings, updateNotifications, updatePrivacy, updateDisplay, updateRegion, hydrated }),
    [settings, updateNotifications, updatePrivacy, updateDisplay, updateRegion, hydrated],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings harus dipakai di dalam <SettingsProvider>");
  }
  return context;
}
