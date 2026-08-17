"use client";

import { Upload, Image as ImageIcon } from "lucide-react";

export default function ImageDropzone({
  id,
  label,
  hint,
  previewUrl,
  onFileSelect,
}: {
  id: string;
  label: string;
  hint: string;
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
}) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) onFileSelect(file);
  }

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-ink-soft">
        {label}
      </label>
      <label
        htmlFor={id}
        className="mt-1.5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-paper px-4 py-8 text-center hover:border-brand/40 focus-within:outline focus-within:outline-4 focus-within:outline-offset-2 focus-within:outline-brand"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- pratinjau blob: URL lokal, next/image tidak relevan di sini
          <img
            src={previewUrl}
            alt={`Pratinjau ${label}`}
            className="h-32 w-32 rounded-lg object-cover"
          />
        ) : (
          <ImageIcon size={28} className="text-ink-soft" aria-hidden="true" />
        )}
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand">
          <Upload size={13} /> {previewUrl ? "Ganti foto" : "Unggah foto"}
        </span>
        <span className="text-xs text-ink-soft">{hint}</span>
      </label>
      <input
        id={id}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="sr-only"
      />
    </div>
  );
}
