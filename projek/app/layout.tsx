import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { ShopProvider } from "@/lib/shop/ShopContext";
import { ToastProvider } from "@/lib/toast/ToastContext";
import { OrderProvider } from "@/lib/orders/OrderContext";
import { UserProvider } from "@/lib/user/UserContext";
import { SettingsProvider } from "@/lib/settings/SettingsContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BelanjAI — Ekosistem AI untuk E-Commerce",
  description:
    "BelanjAI adalah ekosistem enam fitur AI independen untuk pengalaman e-commerce yang lebih aman, personal, dan mudah diakses. Proyek AI Business Innovation — Tim MAGER.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${plexMono.variable}`}>
      <body className="font-sans antialiased">
        <ToastProvider>
          <ShopProvider>
            <OrderProvider>
              <UserProvider>
                <SettingsProvider>
                  <AppShell>{children}</AppShell>
                </SettingsProvider>
              </UserProvider>
            </OrderProvider>
          </ShopProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
