"use client";

import { useRef, useState } from "react";
import { Camera, Upload, Volume2 } from "lucide-react";
import { simulateDetection, type DetectedProduct } from "@/lib/accessibility/visionDemo";

type DetectionStatus = "idle" | "analyzing" | "done";

export default function CameraSimulationPanel() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<DetectionStatus>("idle");
  const [result, setResult] = useState<DetectedProduct | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setResult(null);
    setStatus("analyzing");

    // SIMULASI: jeda buatan supaya terasa seperti proses analisis gambar.
    // Lihat lib/accessibility/visionDemo.ts — tidak ada model computer
    // vision yang benar-benar berjalan di sini.
    window.setTimeout(() => {
      setResult(simulateDetection(file));
      setStatus("done");
    }, 900);
  };

  const speakResult = () => {
    // BENAR-BENAR BERFUNGSI: pembacaan hasil (teks) memakai Speech
    // Synthesis API bawaan browser. Hasil yang dibacakan sendiri tetap
    // berasal dari data simulasi di atas.
    if (!result || !("speechSynthesis" in window)) return;
    const text = `Produk terdeteksi: ${result.name}, kategori ${result.category}, tingkat keyakinan ${Math.round(
      result.confidence * 100,
    )} persen.`;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section
      aria-labelledby="camera-panel-heading"
      className="rounded-2xl border border-line bg-card p-6"
    >
      <h3 id="camera-panel-heading" className="text-base font-semibold text-ink">
        Simulasi Kamera
      </h3>
      <p className="mt-1 text-sm text-ink-soft">
        Unggah foto produk untuk mensimulasikan pengenalan produk lewat kamera.
      </p>

      <label
        htmlFor="camera-upload"
        className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-paper px-4 py-10 text-center hover:border-brand/40 focus-within:outline focus-within:outline-4 focus-within:outline-offset-2 focus-within:outline-brand"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- pratinjau blob: URL lokal, next/image tidak relevan di sini
          <img
            src={previewUrl}
            alt="Pratinjau foto produk yang diunggah"
            className="h-32 w-32 rounded-lg object-cover"
          />
        ) : (
          <Camera size={32} className="text-ink-soft" aria-hidden="true" />
        )}
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand">
          <Upload size={14} /> {previewUrl ? "Ganti foto" : "Unggah foto produk"}
        </span>
        <span className="text-xs text-ink-soft">JPG atau PNG</span>
      </label>
      <input
        ref={inputRef}
        id="camera-upload"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="sr-only"
        aria-describedby="camera-upload-help"
      />
      <p id="camera-upload-help" className="sr-only">
        Pilih foto produk dari perangkat Anda untuk melihat simulasi hasil deteksi.
      </p>

      <div role="status" aria-live="polite" className="mt-4">
        {status === "analyzing" && (
          <p className="text-sm font-medium text-ink-soft">Menganalisis gambar...</p>
        )}

        {status === "done" && result && (
          <div className="rounded-xl border border-line bg-paper p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Produk terdeteksi (simulasi)
            </p>
            <p className="mt-1 text-sm font-semibold text-ink">{result.name}</p>
            <p className="text-xs text-ink-soft">{result.category}</p>

            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${Math.round(result.confidence * 100)}%` }}
              />
            </div>
            <p className="mt-1 font-mono text-xs text-ink-soft">
              Keyakinan: {Math.round(result.confidence * 100)}%
            </p>

            <button
              type="button"
              onClick={speakResult}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-ink hover:border-brand/40 hover:text-brand"
            >
              <Volume2 size={14} /> Bacakan hasil
            </button>

            <p className="mt-3 text-xs leading-relaxed text-ink-soft">
              Catatan: ini hasil simulasi statis untuk demo. Versi produksi akan memakai
              model computer vision (mis. CLIP untuk pencocokan katalog atau YOLO untuk
              deteksi objek) yang benar-benar menganalisis gambar.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
