import type { LucideIcon } from "lucide-react";
import {
  Accessibility,
  ShieldCheck,
  MessageCircle,
  Wallet,
  BarChart3,
  Camera,
} from "lucide-react";
import type { AccentKey } from "@/lib/accent";

export type FeatureStatus = "live" | "soon";

export interface Feature {
  slug: string;
  number: string;
  title: string;
  navLabel: string;
  blurb: string;
  description: string;
  pipeline: string;
  status: FeatureStatus;
  icon: LucideIcon;
  accent: AccentKey;
}

export const features: Feature[] = [
  {
    slug: "accessibility",
    number: "01",
    title: "AI Accessibility Commerce",
    navLabel: "Aksesibilitas",
    blurb: "Belanja dengan suara atau kamera",
    description:
      "Pengalaman belanja yang dapat diakses semua orang — kombinasi Automatic Speech Recognition (ASR), Text-to-Speech (TTS), Natural Language Understanding (NLU), dan Computer Vision untuk berbelanja lewat suara dan kamera, terutama bagi pengguna tunanetra.",
    pipeline: "ASR/CV → NLU INTENT → TTS",
    status: "live",
    icon: Accessibility,
    accent: "violet",
  },
  {
    slug: "fake-review",
    number: "02",
    title: "AI Fake Review Detection",
    navLabel: "Deteksi Ulasan Palsu",
    blurb: "Jaga keputusan belanja dengan ulasan asli",
    description:
      "Mendeteksi ulasan palsu dengan model klasifikasi teks (IndoBERT) dikombinasikan dengan sinyal perilaku non-teks — frekuensi posting, kemiripan teks, pola waktu, dan kesesuaian rating dengan sentimen. Hasilnya berupa skor kepercayaan yang transparan (explainable), bukan keputusan mutlak.",
    pipeline: "TEKS + PERILAKU → SKOR → EXPLAIN",
    status: "live",
    icon: ShieldCheck,
    accent: "rose",
  },
  {
    slug: "chatbot",
    number: "03",
    title: "AI Product Intelligence Chatbot",
    navLabel: "Chatbot Produk",
    blurb: "Ringkasan & pencarian produk cerdas",
    description:
      "Asisten belanja percakapan berbasis RAG (retrieval-augmented generation) yang mencari produk paling relevan dari katalog lewat TF-IDF + cosine similarity, lalu menjawab hanya berdasar data hasil retrieval — bukan mengarang.",
    pipeline: "RETRIEVAL → GROUNDING → GENERATION",
    status: "live",
    icon: MessageCircle,
    accent: "blue",
  },
  {
    slug: "financial-coach",
    number: "04",
    title: "AI Personal Financial Shopping Coach",
    navLabel: "Coach Keuangan",
    blurb: "Kelola anggaran dan ingatkan pengeluaran",
    description:
      "Pendamping keuangan pribadi yang memantau anggaran belanja bulanan lewat rule-based budget engine dan proyeksi exponential smoothing, lalu memberi peringatan dini sebelum anggaran habis.",
    pipeline: "TRANSAKSI → SMOOTHING → PERINGATAN DINI",
    status: "live",
    icon: Wallet,
    accent: "emerald",
  },
  {
    slug: "sme-consultant",
    number: "05",
    title: "AI SME Business Consultant",
    navLabel: "Konsultan Bisnis",
    blurb: "Insight penjualan untuk tumbuhkan bisnis",
    description:
      "Konsultan bisnis AI untuk pelaku UMKM — analitik deskriptif, deteksi anomali, dan narasi insight berbahasa natural (grounded generation) yang merekomendasikan aksi seperti restock, promosi, dan penyesuaian harga berdasarkan data penjualan nyata.",
    pipeline: "DATA PENJUALAN → ANALITIK → INSIGHT",
    status: "live",
    icon: BarChart3,
    accent: "amber",
  },
  {
    slug: "defect-screening",
    number: "06",
    title: "AI Damage/Defect Pre-Screening",
    navLabel: "Cek Kondisi Barang",
    blurb: "Periksa kondisi barang sebelum kirim",
    description:
      "Membandingkan foto kondisi barang sebelum dan sesudah untuk mendeteksi kerusakan/cacat, lengkap dengan bukti digital (timestamp + hash SHA-256) sebagai bukti objektif dalam sengketa klaim retur.",
    pipeline: "UNGGAH FOTO → DETEKSI VISUAL → LAPORAN",
    status: "live",
    icon: Camera,
    accent: "slate",
  },
];

export function getFeature(slug: string): Feature | undefined {
  return features.find((feature) => feature.slug === slug);
}
