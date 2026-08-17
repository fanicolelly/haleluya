"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, User, Bell, Shield, Palette, Globe } from "lucide-react";
import AccountSection from "@/components/settings/AccountSection";
import NotificationSection from "@/components/settings/NotificationSection";
import PrivacySection from "@/components/settings/PrivacySection";
import DisplaySection from "@/components/settings/DisplaySection";
import RegionSection from "@/components/settings/RegionSection";
import MobileSettingsAccordion, { type SettingsTabConfig } from "@/components/settings/MobileSettingsAccordion";

const TABS: SettingsTabConfig[] = [
  { key: "akun", label: "Akun", icon: User, component: AccountSection },
  { key: "notifikasi", label: "Notifikasi", icon: Bell, component: NotificationSection },
  { key: "privasi", label: "Privasi", icon: Shield, component: PrivacySection },
  { key: "tampilan", label: "Tampilan", icon: Palette, component: DisplaySection },
  { key: "bahasa", label: "Bahasa & Wilayah", icon: Globe, component: RegionSection },
];

export default function PengaturanPage() {
  const [activeKey, setActiveKey] = useState(TABS[0].key);
  const ActiveContent = TABS.find((tab) => tab.key === activeKey)?.component ?? TABS[0].component;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/profil"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft transition-colors hover:text-brand"
      >
        <ChevronLeft size={16} aria-hidden="true" /> Kembali ke Profil
      </Link>

      <h1 className="mt-3 text-2xl font-bold text-ink">Pengaturan</h1>
      <p className="mt-1 text-sm text-ink-soft">Kelola akun, notifikasi, privasi, tampilan, dan preferensi wilayah.</p>

      <div className="mt-6 hidden lg:grid lg:grid-cols-[220px_1fr] lg:gap-6">
        <nav className="space-y-1">
          {TABS.map(({ key, label, icon: Icon }) => {
            const active = key === activeKey;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveKey(key)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-colors ${
                  active ? "bg-brand/10 text-brand" : "text-ink-soft hover:bg-card hover:text-ink"
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </nav>
        <div>
          <ActiveContent />
        </div>
      </div>

      <div className="mt-6">
        <MobileSettingsAccordion tabs={TABS} />
      </div>
    </div>
  );
}
