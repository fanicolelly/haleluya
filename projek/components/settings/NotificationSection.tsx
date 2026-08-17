"use client";

import Switch from "@/components/ui/Switch";
import { useSettings } from "@/lib/settings/SettingsContext";

export default function NotificationSection() {
  const { settings, updateNotifications } = useSettings();
  const { notifications } = settings;

  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <h2 className="text-sm font-semibold text-ink">Notifikasi</h2>
      <div className="mt-2 divide-y divide-line">
        <Switch
          id="notif-email-promo"
          label="Notifikasi Email Promo"
          description="Dapatkan info diskon dan penawaran khusus lewat email."
          checked={notifications.emailPromo}
          onChange={(checked) => updateNotifications({ emailPromo: checked })}
        />
        <Switch
          id="notif-order-status"
          label="Notifikasi Status Pesanan"
          description="Pemberitahuan saat status pesanan Anda berubah."
          checked={notifications.orderStatus}
          onChange={(checked) => updateNotifications({ orderStatus: checked })}
        />
        <Switch
          id="notif-wishlist-price"
          label="Produk Wishlist Turun Harga"
          description="Diberi tahu saat harga produk di wishlist Anda turun."
          checked={notifications.wishlistPriceDrop}
          onChange={(checked) => updateNotifications({ wishlistPriceDrop: checked })}
        />
        <Switch
          id="notif-push"
          label="Notifikasi Push"
          description="Notifikasi langsung di perangkat Anda."
          checked={notifications.pushNotification}
          onChange={(checked) => updateNotifications({ pushNotification: checked })}
        />
      </div>
    </div>
  );
}
