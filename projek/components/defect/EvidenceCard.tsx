import { ShieldCheck } from "lucide-react";
import type { EvidenceRecord } from "@/lib/defect/types";

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "medium" });
}

// Kartu bukti bergaya dokumen resmi — memakai motif tepi sobek "struk" yang
// sama dengan panel grounding di fitur chatbot (lihat .receipt-tear di
// app/globals.css) supaya bahasa visualnya konsisten se-aplikasi.
export default function EvidenceCard({ evidence }: { evidence: EvidenceRecord }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-card shadow-sm">
      <div className="receipt-tear" aria-hidden="true" />
      <div className="p-6">
        <div className="flex items-center justify-between border-b border-dashed border-line pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-brand" aria-hidden="true" />
            <p className="text-sm font-bold text-ink">Kartu Bukti Kondisi Barang</p>
          </div>
          <span className="rounded bg-ink px-2 py-0.5 font-mono text-[9.5px] tracking-wide text-white">
            DIGITAL EVIDENCE
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
              Foto Sebelumnya
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element -- pratinjau blob: URL lokal */}
            <img
              src={evidence.beforeImage.previewUrl}
              alt="Foto kondisi barang sebelumnya"
              className="mt-1.5 aspect-square w-full rounded-lg border border-line object-cover"
            />
            <p className="mt-1 truncate font-mono text-[10px] text-ink-soft">
              {evidence.beforeImage.name}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
              Foto Saat Ini
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element -- pratinjau blob: URL lokal */}
            <img
              src={evidence.afterImage.previewUrl}
              alt="Foto kondisi barang saat ini"
              className="mt-1.5 aspect-square w-full rounded-lg border border-line object-cover"
            />
            <p className="mt-1 truncate font-mono text-[10px] text-ink-soft">
              {evidence.afterImage.name}
            </p>
          </div>
        </div>

        <div className="my-4 border-t border-dashed border-line" />

        <dl className="space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-ink-soft">Skor konsistensi</dt>
            <dd className="font-semibold text-ink">{evidence.consistencyScore.toFixed(1)}%</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-ink-soft">Waktu pemeriksaan</dt>
            <dd className="text-right text-ink">{formatTimestamp(evidence.timestamp)}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Hash SHA-256 · Foto Sebelumnya</dt>
            <dd className="mt-0.5 break-all text-ink">{evidence.beforeImage.hash}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Hash SHA-256 · Foto Saat Ini</dt>
            <dd className="mt-0.5 break-all text-ink">{evidence.afterImage.hash}</dd>
          </div>
        </dl>

        <p className="mt-4 text-[10.5px] leading-relaxed text-ink-soft">
          Kartu ini bersifat prototipe/demo. Hash SHA-256 di atas benar-benar dihitung dari
          file gambar (Web Crypto API), tapi belum disimpan ke infrastruktur tepercaya (mis.
          server dengan timestamp resmi atau notarisasi blockchain) yang dibutuhkan supaya
          benar-benar tidak bisa dimanipulasi sebagai bukti sengketa produksi.
        </p>
      </div>
    </div>
  );
}
