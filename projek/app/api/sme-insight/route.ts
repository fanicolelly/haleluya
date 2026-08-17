import { NextResponse } from "next/server";
import { generateTemplateInsight } from "@/lib/sme/templateInsight";
import { formatSummaryForPrompt } from "@/lib/sme/insightPrompt";
import type { InsightSummary } from "@/lib/sme/types";

const SYSTEM_PROMPT =
  "Anda adalah konsultan bisnis AI untuk pelaku UMKM di platform BelanjAI. Anda akan " +
  "menerima RINGKASAN DATA PENJUALAN (angka agregat per produk, tren, dan anomali) — " +
  "bukan data transaksi mentah. Tugas Anda: ubah angka-angka itu menjadi narasi insight " +
  "yang mudah dipahami pelaku usaha kecil, lalu berikan rekomendasi aksi konkret (mis. " +
  "restock, promosi, penyesuaian harga) berdasarkan pola yang benar-benar terlihat di " +
  "data. ATURAN PENTING: HANYA boleh merujuk pada angka yang diberikan di data — jangan " +
  "pernah mengarang produk, angka, atau tren yang tidak ada di situ. Tulis dalam Bahasa " +
  "Indonesia yang ramah, hindari jargon teknis/statistik, maksimal 6-8 kalimat termasuk " +
  "rekomendasi.";

const MODEL = "claude-sonnet-5";
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

export async function POST(request: Request) {
  let summary: InsightSummary;
  try {
    const body = (await request.json()) as { summary?: InsightSummary };
    if (!body.summary) throw new Error("missing summary");
    summary = body.summary;
  } catch {
    return NextResponse.json({ error: "Body request tidak valid." }, { status: 400 });
  }

  // TANPA API KEY: langsung pakai narasi template lokal (lihat
  // lib/sme/templateInsight.ts) yang disusun dari ringkasan angka yang sama
  // — tidak perlu setup apa pun.
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ insight: generateTemplateInsight(summary), mode: "template" });
  }

  const promptText = formatSummaryForPrompt(summary);

  // OPSIONAL: kalau ANTHROPIC_API_KEY diisi, pakai Claude sungguhan untuk
  // narasi yang lebih natural. Kalau gagal karena alasan apa pun, fallback
  // ke template — endpoint ini tidak pernah benar-benar error ke pengguna.
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
        max_tokens: 700,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Ringkasan data penjualan (JANGAN mengarang di luar data ini):\n\n${promptText}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error, fallback ke template:", response.status, errorText);
      return NextResponse.json({ insight: generateTemplateInsight(summary), mode: "template" });
    }

    const data = (await response.json()) as { content?: { type: string; text?: string }[] };
    const textBlock = data.content?.find((block) => block.type === "text");
    const insight = textBlock?.text ?? generateTemplateInsight(summary);

    return NextResponse.json({ insight, mode: "llm" });
  } catch (error) {
    console.error("SME insight API error, fallback ke template:", error);
    return NextResponse.json({ insight: generateTemplateInsight(summary), mode: "template" });
  }
}
