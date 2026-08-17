import Link from "next/link";
import { Pencil } from "lucide-react";
import type { UserProfile } from "@/lib/user/types";
import Avatar from "@/components/profile/Avatar";

function formatJoinDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function ProfileHeader({ profile }: { profile: UserProfile }) {
  return (
    <div className="flex flex-wrap items-center gap-5 rounded-2xl border border-line bg-card p-6">
      <Avatar name={profile.name} photoUrl={profile.photoUrl} size={72} />

      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-bold text-ink sm:text-2xl">{profile.name}</h1>
        <p className="mt-0.5 text-sm text-ink-soft">{profile.email}</p>
        <p className="mt-0.5 text-xs text-ink-soft">{profile.phone}</p>
        <p className="mt-1.5 font-mono text-[10.5px] text-ink-soft">
          Bergabung sejak {formatJoinDate(profile.joinedDate)}
        </p>
      </div>

      <Link
        href="/profil/edit"
        className="inline-flex items-center gap-1.5 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-brand/40 hover:text-brand"
      >
        <Pencil size={14} /> Edit Profil
      </Link>
    </div>
  );
}
