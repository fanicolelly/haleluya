"use client";

import { useEffect, useState } from "react";
import ImageDropzone from "@/components/defect/ImageDropzone";
import ComparisonResultCard from "@/components/defect/ComparisonResultCard";
import EvidenceCard from "@/components/defect/EvidenceCard";
import { compareImages } from "@/lib/defect/imageCompare";
import { sha256Hex } from "@/lib/defect/hash";
import { classifyVerdict, type EvidenceRecord } from "@/lib/defect/types";

export default function DefectScreeningDemo() {
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [evidence, setEvidence] = useState<EvidenceRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleBeforeSelect(file: File) {
    setBeforeFile(file);
    setBeforePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  function handleAfterSelect(file: File) {
    setAfterFile(file);
    setAfterPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  useEffect(() => {
    if (!beforeFile || !afterFile) {
      setEvidence(null);
      setStatus("idle");
      return;
    }

    let cancelled = false;
    setStatus("processing");
    setErrorMsg(null);

    (async () => {
      try {
        const [comparison, beforeHash, afterHash] = await Promise.all([
          compareImages(beforeFile, afterFile),
          sha256Hex(beforeFile),
          sha256Hex(afterFile),
        ]);

        if (cancelled) return;

        setEvidence({
          id: `evid-${Date.now()}`,
          beforeImage: { name: beforeFile.name, hash: beforeHash, previewUrl: beforePreview as string },
          afterImage: { name: afterFile.name, hash: afterHash, previewUrl: afterPreview as string },
          consistencyScore: comparison.consistencyScore,
          pixelDifferencePercent: comparison.pixelDifferencePercent,
          hashHammingDistance: comparison.hashHammingDistance,
          hashTotalBits: comparison.hashTotalBits,
          timestamp: new Date().toISOString(),
          verdict: classifyVerdict(comparison.consistencyScore),
        });
        setStatus("done");
      } catch (err) {
        if (cancelled) return;
        setErrorMsg(err instanceof Error ? err.message : "Gagal memproses gambar.");
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beforeFile, afterFile]);

  return (
    <div className="mt-10 space-y-6">
      <div className="rounded-2xl border border-line bg-brand-soft/60 px-5 py-4 text-sm text-ink-soft">
        <strong className="text-ink">Tentang demo ini:</strong> hash SHA-256 di kartu bukti
        benar-benar dihitung dari file gambar (Web Crypto API). Skor konsistensinya
        SIMULASI — perbandingan piksel/perceptual hash sederhana di Canvas API, bukan model
        Siamese Network/CNN classifier cacat sungguhan. Lihat komentar di{" "}
        <code className="font-mono text-xs">lib/defect/imageCompare.ts</code> untuk detail
        keterbatasannya.
      </div>

      <div className="rounded-2xl border border-line bg-card p-5">
        <h3 className="text-sm font-semibold text-ink">Unggah Foto untuk Dibandingkan</h3>
        <p className="mt-1 text-xs text-ink-soft">
          Perbandingan berjalan otomatis begitu kedua foto terunggah.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ImageDropzone
            id="before-photo"
            label="Foto Sebelumnya"
            hint="Kondisi awal saat listing"
            previewUrl={beforePreview}
            onFileSelect={handleBeforeSelect}
          />
          <ImageDropzone
            id="after-photo"
            label="Foto Saat Ini"
            hint="Sebelum pengiriman"
            previewUrl={afterPreview}
            onFileSelect={handleAfterSelect}
          />
        </div>

        <div role="status" aria-live="polite">
          {status === "processing" && (
            <p className="mt-4 text-sm text-ink-soft">Membandingkan gambar &amp; menghitung hash...</p>
          )}
          {status === "error" && <p className="mt-4 text-sm text-rose-600">⚠️ {errorMsg}</p>}
        </div>
      </div>

      {evidence && (
        <>
          <ComparisonResultCard evidence={evidence} />
          <EvidenceCard evidence={evidence} />
        </>
      )}
    </div>
  );
}
