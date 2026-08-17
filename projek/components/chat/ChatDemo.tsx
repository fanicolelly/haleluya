"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage, RetrievedProduct } from "@/lib/chat/types";
import ChatPanel from "@/components/chat/ChatPanel";
import SourceReceiptPanel from "@/components/chat/SourceReceiptPanel";

const GREETING: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "Halo! Saya asisten belanja BelanjAI. Ceritakan apa yang Anda cari — misalnya kebutuhan, budget, atau kategori — dan saya akan cari produk yang paling relevan dari katalog.",
};

export default function ChatDemo({ initialQuery }: { initialQuery?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [retrieved, setRetrieved] = useState<RetrievedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const idCounter = useRef(0);
  const initialQuerySent = useRef(false);

  function nextId(): string {
    idCounter.current += 1;
    return `msg-${idCounter.current}`;
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = { id: nextId(), role: "user", content: trimmed };
    const nextHistory = [...messages, userMessage];

    setMessages(nextHistory);
    setLoading(true);

    try {
      // Riwayat percakapan penuh dikirim tiap turn (multi-turn) — server
      // hanya menjalankan retrieval baru untuk pesan user TERAKHIR.
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: nextHistory }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Terjadi kendala saat menghubungi model AI.");
      }

      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", content: data.reply, mode: data.mode },
      ]);
      setRetrieved(data.retrieved ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kendala saat menghubungi model AI.";
      setMessages((prev) => [...prev, { id: nextId(), role: "assistant", content: `⚠️ ${message}` }]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!initialQuery || initialQuerySent.current) return;
    initialQuerySent.current = true;
    sendMessage(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  return (
    <div className="mt-10">
      <div className="rounded-2xl border border-line bg-brand-soft/60 px-5 py-4 text-sm text-ink-soft">
        <strong className="text-ink">Tentang demo ini:</strong> retrieval (pencarian produk
        lewat TF-IDF + cosine similarity) selalu berjalan asli. Jawabannya, secara default,
        disusun dari <strong>template</strong> berbasis data hasil retrieval — tidak butuh
        API key sama sekali. Isi <code className="font-mono text-xs">ANTHROPIC_API_KEY</code>{" "}
        di <code className="font-mono text-xs">.env.local</code> (opsional) kalau mau jawaban
        yang benar-benar dihasilkan Claude.
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr]">
        <ChatPanel messages={messages} loading={loading} onSend={sendMessage} />
        <SourceReceiptPanel products={retrieved} />
      </div>
    </div>
  );
}
