"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import type { ChatMessage } from "@/lib/chat/types";

const SUGGESTIONS = [
  "hp buat vlog kualitas bagus",
  "sepatu lari di bawah 200rb",
  "skincare buat kulit berminyak",
  "alat masak hemat listrik anak kos",
];

export default function ChatPanel({
  messages,
  loading,
  onSend,
}: {
  messages: ChatMessage[];
  loading: boolean;
  onSend: (text: string) => void;
}) {
  const [input, setInput] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [messages, loading]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!input.trim() || loading) return;
    onSend(input);
    setInput("");
  }

  function handleChipClick(text: string) {
    if (loading) return;
    onSend(text);
  }

  return (
    <section
      aria-labelledby="chat-panel-heading"
      className="flex flex-col overflow-hidden rounded-2xl border border-line bg-card"
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <h3 id="chat-panel-heading" className="text-sm font-semibold text-ink">
          Percakapan
        </h3>
        <span role="status" aria-live="polite" className="font-mono text-xs text-ink-soft">
          {loading ? "mencari..." : "siap"}
        </span>
      </div>

      <p className="border-b border-line px-5 py-2 text-center font-mono text-[11px] text-ink-soft">
        Katalog demo berisi 14 produk. Coba tanya seperti pembeli sungguhan.
      </p>

      <div
        ref={bodyRef}
        className="flex min-h-[360px] max-h-[460px] flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed " +
              (message.role === "user"
                ? "self-end rounded-br-sm bg-brand text-white"
                : "self-start whitespace-pre-wrap rounded-bl-sm border border-line bg-paper text-ink")
            }
          >
            {message.mode && (
              <span
                className={
                  "mb-1.5 inline-block rounded-full px-2 py-0.5 font-mono text-[9.5px] tracking-wide " +
                  (message.mode === "llm"
                    ? "bg-brand text-white"
                    : "border border-line bg-card text-ink-soft")
                }
              >
                {message.mode === "llm" ? "CLAUDE" : "TEMPLATE"}
              </span>
            )}
            <div>{message.content}</div>
          </div>
        ))}
        {loading && (
          <div className="max-w-[88%] self-start rounded-2xl rounded-bl-sm border border-line bg-paper px-3.5 py-2.5 text-sm italic text-ink-soft">
            Mengambil data produk dan menyusun jawaban...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-line p-4">
        <div className="mb-2.5 flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleChipClick(suggestion)}
              disabled={loading}
              className="rounded-full border border-brand/25 bg-brand-soft px-3 py-1.5 font-mono text-[11px] text-brand hover:bg-brand-soft/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Tulis pertanyaan seperti pembeli, mis. 'tas laptop tahan air budget 300rb'..."
            aria-label="Tulis pesan"
            className="flex-1 rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={15} /> Kirim
          </button>
        </div>
      </form>
    </section>
  );
}
