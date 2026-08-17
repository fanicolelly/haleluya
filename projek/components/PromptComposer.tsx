"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Paperclip, Send } from "lucide-react";

const suggestions = ["Rekomendasi sepatu lari", "Bandingkan headphone terbaik"];

export default function PromptComposer() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  function goToChatbot(text: string) {
    const trimmed = text.trim();
    const query = trimmed ? `?q=${encodeURIComponent(trimmed)}` : "";
    router.push(`/fitur/chatbot${query}`);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    goToChatbot(prompt);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-card p-5 sm:p-6">
      <input
        type="text"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="Tanyakan apa saja tentang produk, pesanan, atau rekomendasi..."
        aria-label="Tanyakan sesuatu ke asisten BelanjAI"
        className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none"
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled
          title="Lampiran belum tersedia di demo ini"
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-xs text-ink-soft opacity-60"
        >
          <Paperclip size={13} /> Lampirkan
        </button>

        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => goToChatbot(suggestion)}
            className="rounded-full border border-line px-3.5 py-1.5 text-xs text-ink-soft transition-colors hover:border-brand/40 hover:text-brand"
          >
            {suggestion}
          </button>
        ))}

        <button
          type="submit"
          disabled={!prompt.trim()}
          className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={15} /> Kirim
        </button>
      </div>
    </form>
  );
}
