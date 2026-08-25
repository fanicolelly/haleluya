"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mic, MicOff, Volume2, Square, Star, ArrowRight } from "lucide-react";
import { classifyIntent, COMMAND_EXAMPLES, type IntentResult } from "@/lib/accessibility/intent";
import { useShop } from "@/lib/shop/ShopContext";
import { useToast } from "@/lib/toast/ToastContext";

function rupiah(amount: number): string {
  return "Rp" + amount.toLocaleString("id-ID");
}

type RecognitionStatus = "idle" | "listening" | "unsupported" | "error";

export default function VoiceCommandPanel() {
  const [status, setStatus] = useState<RecognitionStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [intent, setIntent] = useState<IntentResult | null>(null);
  const [manualText, setManualText] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const { showToast } = useToast();

  // Handler dibungkus ref supaya callback SpeechRecognition (dipasang sekali
  // di useEffect dengan deps kosong) selalu memanggil versi terbaru, bukan
  // closure basi dari render pertama.
  const runCommandRef = useRef<(text: string) => void>(() => {});

  // BENAR-BENAR BERFUNGSI: intent "masukkan ke keranjang" / "simpan ke
  // wishlist" tidak berhenti di teks — di sini aksinya sungguh dijalankan
  // lewat ShopContext, jadi isinya muncul di halaman keranjang/wishlist.
  // Dipanggil dari event handler (bukan saat render) supaya tepat sekali
  // per perintah.
  runCommandRef.current = (text: string) => {
    const result = classifyIntent(text);
    setTranscript(text);
    setIntent(result);

    if (!result.action) return;

    const { type, product } = result.action;
    if (type === "tambah_keranjang") {
      addToCart(product.id, 1);
      return;
    }

    if (isInWishlist(product.id)) {
      showToast(`${product.name} sudah ada di wishlist`, "info");
    } else {
      toggleWishlist(product.id);
      showToast(`${product.name} disimpan ke wishlist`, "success");
    }
  };

  useEffect(() => {
    // BENAR-BENAR BERFUNGSI: SpeechRecognition adalah Web Speech API bawaan
    // browser (gratis, tanpa API eksternal berbayar). Tidak semua browser
    // mendukungnya (mis. Firefox), sehingga kita cek dukungannya dulu dan
    // sediakan input teks manual sebagai jalur alternatif di bawah.
    const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setStatus("unsupported");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "id-ID";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let text = "";
      let isFinal = false;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
        if (event.results[i].isFinal) isFinal = true;
      }

      setTranscript(text);

      // BENAR-BENAR BERFUNGSI: klasifikasi intent (lihat lib/accessibility/intent.ts)
      // benar-benar dijalankan terhadap transkrip nyata, hanya saja logikanya
      // masih keyword matching, bukan model NLU terlatih.
      if (isFinal) {
        runCommandRef.current(text);
      }
    };

    recognition.onend = () => {
      setStatus("idle");
    };

    recognition.onerror = () => {
      setStatus("error");
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const handleToggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (status === "listening") {
      recognition.stop();
      return;
    }

    setTranscript("");
    setIntent(null);

    try {
      recognition.start();
      setStatus("listening");
    } catch {
      setStatus("error");
    }
  };

  const handleManualSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!manualText.trim()) return;
    runCommandRef.current(manualText);
  };

  const speak = (text: string) => {
    // BENAR-BENAR BERFUNGSI: Web Speech Synthesis API bawaan browser,
    // tidak membutuhkan API eksternal berbayar.
    if (!("speechSynthesis" in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <section
      aria-labelledby="voice-panel-heading"
      className="rounded-2xl border border-line bg-card p-6"
    >
      <h3 id="voice-panel-heading" className="text-base font-semibold text-ink">
        Perintah Suara
      </h3>
      <p className="mt-1 text-sm text-ink-soft">
        Tekan tombol mikrofon lalu ucapkan perintah — mencari produk, menanyakan harga
        atau stok, menambah ke keranjang, sampai membuka halaman pesanan. Ucapkan
        “perintah apa saja?” untuk mendengar daftar lengkapnya.
      </p>

      <div className="mt-6 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={handleToggleListening}
          disabled={status === "unsupported"}
          aria-pressed={status === "listening"}
          aria-label={
            status === "listening" ? "Berhenti merekam perintah suara" : "Mulai rekam perintah suara"
          }
          className={
            "flex h-24 w-24 items-center justify-center rounded-full text-white shadow-sm transition-colors focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:bg-slate-300 " +
            (status === "listening" ? "animate-pulse bg-rose-600" : "bg-brand hover:bg-brand-dark")
          }
        >
          {status === "listening" ? <MicOff size={32} /> : <Mic size={32} />}
        </button>

        <p role="status" aria-live="polite" className="text-sm font-medium text-ink-soft">
          {status === "listening" && "Mendengarkan..."}
          {status === "unsupported" && "Mikrofon tidak didukung browser ini"}
          {status === "error" && "Terjadi kendala mikrofon, coba lagi"}
          {status === "idle" && !transcript && "Tekan tombol untuk mulai bicara"}
          {status === "idle" && transcript && "Selesai merekam"}
        </p>
      </div>

      {status === "unsupported" && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800"
        >
          Browser Anda belum mendukung Web Speech API untuk pengenalan suara (coba
          Chrome/Edge terbaru). Gunakan kolom teks di bawah sebagai alternatif.
        </p>
      )}

      <form onSubmit={handleManualSubmit} className="mt-5">
        <label htmlFor="manual-command" className="block text-xs font-medium text-ink-soft">
          Atau ketik perintah secara manual
        </label>
        <div className="mt-1.5 flex gap-2">
          <input
            id="manual-command"
            type="text"
            value={manualText}
            onChange={(event) => setManualText(event.target.value)}
            placeholder="mis. cari sepatu lari"
            className="flex-1 rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink/90"
          >
            Kirim
          </button>
        </div>
      </form>

      <div className="mt-3">
        <p className="text-xs font-medium text-ink-soft">Contoh perintah yang dikenali</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {COMMAND_EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => {
                setManualText(example);
                runCommandRef.current(example);
              }}
              className="rounded-full border border-brand/25 bg-brand-soft px-3 py-1.5 font-mono text-[11px] text-brand hover:bg-brand-soft/70"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {transcript && (
        <div className="mt-5 rounded-xl border border-line bg-paper p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Transkrip</p>
          <p className="mt-1 text-sm text-ink">{transcript}</p>
        </div>
      )}

      {intent && (
        <div className="mt-4 space-y-3">
          <span className="inline-flex rounded-full bg-brand-soft px-3 py-1 font-mono text-xs text-brand">
            Intent: {intent.label}
          </span>
          <p className="text-sm text-ink-soft">{intent.response}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => speak(intent.response)}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-ink hover:border-brand/40 hover:text-brand"
            >
              <Volume2 size={14} /> Bacakan hasil
            </button>
            {speaking && (
              <button
                type="button"
                onClick={stopSpeaking}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-ink-soft hover:text-ink"
              >
                <Square size={12} /> Hentikan
              </button>
            )}
          </div>

          {intent.products && intent.products.length > 0 && (
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {intent.products.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/produk/${product.id}`}
                    className="flex items-center gap-3 rounded-xl border border-line bg-paper p-3 transition-colors hover:border-brand/40"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-medium text-ink">{product.name}</p>
                      <p className="font-mono text-xs font-semibold text-ink">{rupiah(product.price)}</p>
                      <p className="mt-0.5 flex items-center gap-1 font-mono text-[11px] text-ink-soft">
                        <Star size={10} className="fill-amber-400 text-amber-400" aria-hidden="true" />
                        {product.rating}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {intent.nav && (
            <Link
              href={intent.nav.route}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
            >
              {intent.nav.label} <ArrowRight size={15} aria-hidden="true" />
            </Link>
          )}

          {intent.examples && (
            <ul className="space-y-1.5 rounded-xl border border-line bg-paper p-4">
              {intent.examples.map((example) => (
                <li key={example} className="font-mono text-xs text-ink-soft">
                  “{example}”
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
