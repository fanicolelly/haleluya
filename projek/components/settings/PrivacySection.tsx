"use client";

import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";
import Switch from "@/components/ui/Switch";
import { useSettings } from "@/lib/settings/SettingsContext";
import { useToast } from "@/lib/toast/ToastContext";

export default function PrivacySection() {
  const { settings, updatePrivacy } = useSettings();
  const { showToast } = useToast();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line bg-card p-5">
        <h2 className="text-sm font-semibold text-ink">Privasi</h2>
        <div className="mt-2 divide-y divide-line">
          <Switch
            id="privacy-purchase-history"
            label="Visibilitas Riwayat Belanja"
            description="Tampilkan riwayat belanja Anda di halaman profil."
            checked={settings.privacy.purchaseHistoryVisible}
            onChange={(checked) => updatePrivacy({ purchaseHistoryVisible: checked })}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-card p-5">
        <h3 className="text-sm font-semibold text-ink">Unduh Data Pribadi</h3>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft">
          Minta salinan data pribadi Anda yang tersimpan di BelanjAI.
        </p>
        <button
          type="button"
          onClick={() => showToast("Permintaan diproses", "info")}
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand"
        >
          <Download size={15} aria-hidden="true" /> Unduh Data Saya
        </button>
      </div>

      <div className="rounded-2xl border border-line bg-card p-5">
        <Link
          href="/kebijakan-privasi"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
        >
          Baca Kebijakan Privasi <ExternalLink size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
