import type { Product } from "@/lib/products/types";

// Product sekarang didefinisikan di lib/products/types.ts (dipakai bersama
// dengan halaman detail produk) — diekspor ulang di sini supaya kode chat
// yang sudah ada (`import type { Product } from "./types"`) tidak perlu
// diubah.
export type { Product };

export interface RetrievedProduct extends Product {
  score: number; // 0-1, cosine similarity terhadap query
}

export type ChatRole = "user" | "assistant";

// "llm" = benar-benar dijawab Claude, "template" = jawaban fallback lokal
// tanpa API key (lihat lib/chat/templateReply.ts). Hanya relevan untuk
// pesan assistant.
export type ReplyMode = "llm" | "template";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  mode?: ReplyMode;
}
