import { NextResponse } from "next/server";
import { retrieveProducts } from "@/lib/chat/retrieval";
import { generateTemplateReply } from "@/lib/chat/templateReply";
import type { ChatMessage } from "@/lib/chat/types";

const SYSTEM_PROMPT =
  "Anda adalah asisten belanja AI untuk platform e-commerce BelanjAI. JAWAB HANYA " +
  "berdasarkan data produk yang diberikan di pesan pengguna — jangan pernah mengarang " +
  "produk, harga, atau spesifikasi yang tidak ada dalam data itu. Jika tidak ada produk " +
  "yang benar-benar relevan dengan kebutuhan pengguna, katakan dengan jujur bahwa belum " +
  "ada produk yang cocok dan sarankan kata kunci lain. Jawab singkat (maksimal 4-5 " +
  "kalimat), ramah, dalam Bahasa Indonesia, dan sebutkan nama produk spesifik beserta " +
  "harganya saat merekomendasikan.";

const MODEL = "claude-sonnet-5";
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

export async function POST(request: Request) {
  let history: ChatMessage[];
  try {
    const body = (await request.json()) as { messages?: ChatMessage[] };
    history = body.messages ?? [];
  } catch {
    return NextResponse.json({ error: "Body request tidak valid." }, { status: 400 });
  }

  const lastMessage = history[history.length - 1];
  if (!lastMessage || lastMessage.role !== "user" || !lastMessage.content.trim()) {
    return NextResponse.json({ error: "Pesan pengguna kosong atau tidak valid." }, { status: 400 });
  }

  // RETRIEVAL: cari produk paling relevan (lihat lib/chat/retrieval.ts)
  // berdasarkan pesan pengguna TERBARU saja. Ini selalu jalan terlepas dari
  // ada/tidaknya API key, karena murni komputasi lokal.
  const retrieved = retrieveProducts(lastMessage.content);

  // TANPA API KEY: tidak perlu setup apa pun — langsung pakai jawaban
  // template lokal yang disusun dari data hasil retrieval (lihat
  // lib/chat/templateReply.ts). Ini bukan LLM sungguhan.
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      reply: generateTemplateReply(lastMessage.content, retrieved),
      retrieved,
      mode: "template",
    });
  }

  const contextBlock = retrieved
    .map(
      (product) =>
        `- ${product.name} | kategori: ${product.category} | harga: Rp${product.price.toLocaleString("id-ID")} | rating: ${product.rating} | deskripsi: ${product.desc}`,
    )
    .join("\n");

  // GROUNDING: pola yang sama dengan prototipe HTML — konteks hasil retrieval
  // ditempel ke pesan user TERAKHIR (bukan ke system prompt), supaya system
  // prompt tetap statis antar-turn sementara tiap turn tetap dapat konteks
  // segar yang relevan dengan pertanyaannya sendiri.
  const claudeMessages = history.map((message, index) => {
    if (index !== history.length - 1) {
      return { role: message.role, content: message.content };
    }
    return {
      role: "user" as const,
      content: `Data produk hasil retrieval (konteks, JANGAN mengarang di luar ini):\n${
        contextBlock || "(tidak ada produk relevan ditemukan di katalog)"
      }\n\nPertanyaan pengguna: "${message.content}"`,
    };
  });

  // OPSIONAL: kalau ANTHROPIC_API_KEY diisi, pakai Claude sungguhan untuk
  // jawaban yang lebih natural. Kalau panggilan ini gagal karena alasan
  // apa pun (key salah, network error, dll), fallback ke template — chatbot
  // tidak pernah benar-benar error ke pengguna hanya karena masalah API key.
  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: claudeMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error, fallback ke template:", response.status, errorText);
      return NextResponse.json({
        reply: generateTemplateReply(lastMessage.content, retrieved),
        retrieved,
        mode: "template",
      });
    }

    const data = (await response.json()) as { content?: { type: string; text?: string }[] };
    const textBlock = data.content?.find((block) => block.type === "text");
    const reply = textBlock?.text ?? "Maaf, tidak ada jawaban yang bisa ditampilkan.";

    return NextResponse.json({ reply, retrieved, mode: "llm" });
  } catch (error) {
    console.error("Chat API error, fallback ke template:", error);
    return NextResponse.json({
      reply: generateTemplateReply(lastMessage.content, retrieved),
      retrieved,
      mode: "template",
    });
  }
}
