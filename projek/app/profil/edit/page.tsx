"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useUser } from "@/lib/user/UserContext";
import Avatar from "@/components/profile/Avatar";

export default function EditProfilePage() {
  const { profile, updateProfile, hydrated } = useUser();
  const router = useRouter();

  // Form baru di-mount SETELAH hydrated === true (lihat guard di bawah),
  // supaya useState(profile.xxx) di sini menangkap nilai yang benar-benar
  // sudah dibaca dari localStorage — bukan nilai default sesaat sebelum
  // hidrasi selesai (lihat komentar `hydrated` di lib/user/UserContext.tsx).
  if (!hydrated) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center text-sm text-ink-soft">Memuat profil...</div>
    );
  }

  return <EditProfileForm initialProfile={profile} onSave={updateProfile} onDone={() => router.push("/profil")} />;
}

function EditProfileForm({
  initialProfile,
  onSave,
  onDone,
}: {
  initialProfile: ReturnType<typeof useUser>["profile"];
  onSave: ReturnType<typeof useUser>["updateProfile"];
  onDone: () => void;
}) {
  const [name, setName] = useState(initialProfile.name);
  const [email, setEmail] = useState(initialProfile.email);
  const [phone, setPhone] = useState(initialProfile.phone);
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialProfile.photoUrl);

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Preview lokal saja (data URL) — tidak diunggah ke server mana pun.
    // Data URL (bukan blob: URL) sengaja dipakai supaya tetap valid setelah
    // disimpan ke localStorage & halaman di-reload.
    const reader = new FileReader();
    reader.onload = () => setPhotoUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSave({ name, email, phone, photoUrl });
    onDone();
  }

  return (
    <div className="mx-auto max-w-lg">
      <Link
        href="/profil"
        className="inline-flex items-center gap-1 text-xs font-medium text-ink-soft hover:text-brand"
      >
        <ChevronLeft size={14} /> Kembali ke profil
      </Link>

      <h1 className="mt-6 text-2xl font-bold text-ink sm:text-3xl">Edit Profil</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-2xl border border-line bg-card p-6">
        <div className="flex items-center gap-4">
          <Avatar name={name || "?"} photoUrl={photoUrl} size={64} />
          <label className="inline-flex cursor-pointer items-center rounded-xl border border-line px-3.5 py-2 text-xs font-medium text-ink transition-colors hover:border-brand/40 hover:text-brand">
            Ganti Foto
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="sr-only" />
          </label>
        </div>

        <label className="block text-xs">
          <span className="font-medium text-ink-soft">Nama Lengkap</span>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
          />
        </label>

        <label className="block text-xs">
          <span className="font-medium text-ink-soft">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
          />
        </label>

        <label className="block text-xs">
          <span className="font-medium text-ink-soft">Nomor Telepon</span>
          <input
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
          />
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <Link
            href="/profil"
            className="rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink-soft hover:text-ink"
          >
            Batal
          </Link>
          <button
            type="submit"
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
