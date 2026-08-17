"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageCircle,
  ShoppingBag,
  LayoutGrid,
  ShoppingCart,
  ClipboardList,
  Heart,
  Settings,
  HelpCircle,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { features } from "@/lib/features";
import { useShop } from "@/lib/shop/ShopContext";
import { useUser } from "@/lib/user/UserContext";
import Avatar from "@/components/profile/Avatar";

const mainNav: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/fitur/chatbot", label: "Chat AI", icon: MessageCircle },
  { href: "/produk", label: "Produk", icon: ShoppingBag },
  { href: "/kategori", label: "Kategori", icon: LayoutGrid },
  { href: "/keranjang", label: "Keranjang", icon: ShoppingCart },
  { href: "/pesanan", label: "Pesanan", icon: ClipboardList },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
];

const bottomNav: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
  { href: "/bantuan", label: "Bantuan", icon: HelpCircle },
];

function NavItem({
  href,
  label,
  icon: Icon,
  onNavigate,
  badge,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  onNavigate?: () => void;
  badge?: number;
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors " +
        (active
          ? "bg-brand-soft font-medium text-brand"
          : "text-ink-soft hover:bg-paper hover:text-ink")
      }
    >
      <Icon size={18} strokeWidth={2} />
      <span className="flex-1">{label}</span>
      {!!badge && badge > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 font-mono text-[10px] text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { cartCount, wishlist } = useShop();
  const { profile } = useUser();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-line bg-white">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
          <ShoppingBag size={18} />
        </span>
        <div>
          <p className="text-base font-bold leading-none text-ink">
            Belanj<span className="text-brand">AI</span>
          </p>
          <p className="mt-1 text-[11px] text-ink-soft">Smart Commerce Assistant</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="space-y-1">
          {mainNav.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              onNavigate={onNavigate}
              badge={
                item.href === "/keranjang"
                  ? cartCount
                  : item.href === "/wishlist"
                    ? wishlist.length
                    : undefined
              }
            />
          ))}
        </div>

        <p className="mb-2 mt-6 px-3 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
          Fitur AI
        </p>
        <div className="space-y-1">
          {features.map((feature) => (
            <NavItem
              key={feature.slug}
              href={`/fitur/${feature.slug}`}
              label={feature.navLabel}
              icon={feature.icon}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>

      <div className="border-t border-line px-3 py-4">
        <div className="space-y-1">
          {bottomNav.map((item) => (
            <NavItem key={item.href} {...item} onNavigate={onNavigate} />
          ))}
        </div>

        <Link
          href="/profil"
          onClick={onNavigate}
          className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-paper"
        >
          <Avatar name={profile.name} photoUrl={profile.photoUrl} size={32} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-ink">
              {profile.name}
            </span>
            <span className="block text-xs text-ink-soft">Lihat profil</span>
          </span>
          <ChevronRight size={16} className="shrink-0 text-ink-soft" />
        </Link>
      </div>
    </aside>
  );
}
