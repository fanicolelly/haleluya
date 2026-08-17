"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useUser } from "@/lib/user/UserContext";
import { useToast } from "@/lib/toast/ToastContext";
import DeleteAccountButton from "@/components/settings/DeleteAccountButton";

// Form di bawah ini butuh nilai email yang SUDAH ter-hidrasi dari
// localStorage sebagai initial value (useState hanya membaca sekali saat
// mount). Karena itu AccountSection menahan mount form sampai
// `hydrated === true` — pola yang sama seperti app/profil/edit/page.tsx,
// untuk menghindari race condition yang sama.
export default function AccountSection() {
  const { profile, hydrated } = useUser();

  if (!hydrated) {
    return <p className="text-sm text-ink-soft">Memuat...</p>;
  }

  return <AccountForm initialEmail={profile.email} />;
}

function AccountForm({ initialEmail }: { initialEmail: string }) {
  const { updateProfile } = useUser();
  const { showToast } = useToast();

  const [email, setEmail] = useState(initialEmail);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  function handleEmailSubmit(event: React.FormEvent) {
    event.preventDefault();
    updateProfile({ email }, true);
    showToast("Pengaturan disimpan", "success");
  }

  function handlePasswordSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPasswordError(null);

    // Validasi sisi klien saja untuk demo — proyek ini tidak punya sistem
    // autentikasi sungguhan, jadi "password lama" tidak benar-benar
    // diverifikasi ke mana pun, cuma dicek terisi untuk melengkapi alur form.
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Semua kolom wajib diisi.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password tidak cocok dengan password baru.");
      return;
    }

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Pengaturan disimpan", "success");
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleEmailSubmit} className="rounded-2xl border border-line bg-card p-5">
        <h2 className="text-sm font-semibold text-ink">Ubah Email</h2>
        <label className="mt-3 block text-xs">
          <span className="font-medium text-ink-soft">Alamat Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full max-w-sm rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="mt-4 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          Simpan Email
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="rounded-2xl border border-line bg-card p-5">
        <h2 className="text-sm font-semibold text-ink">Ubah Password</h2>
        <p className="mt-1 text-xs text-ink-soft">
          Demo — validasi hanya di sisi klien, tidak benar-benar mengubah kredensial login.
        </p>

        <div className="mt-3 max-w-sm space-y-3">
          <label className="block text-xs">
            <span className="font-medium text-ink-soft">Password Lama</span>
            <input
              type="password"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
            />
          </label>
          <label className="block text-xs">
            <span className="font-medium text-ink-soft">Password Baru</span>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
            />
          </label>
          <label className="block text-xs">
            <span className="font-medium text-ink-soft">Konfirmasi Password Baru</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
            />
          </label>
        </div>

        {passwordError && <p className="mt-3 text-xs text-rose-600">{passwordError}</p>}

        <button
          type="submit"
          className="mt-4 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          Ubah Password
        </button>
      </form>

      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-rose-700">
          <Trash2 size={15} aria-hidden="true" /> Hapus Akun
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-rose-700/80">
          Menghapus akun akan menghapus seluruh data demo Anda secara permanen.
        </p>
        <div className="mt-4">
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}
