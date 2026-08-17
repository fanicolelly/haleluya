import VoiceCommandPanel from "@/components/accessibility/VoiceCommandPanel";
import CameraSimulationPanel from "@/components/accessibility/CameraSimulationPanel";

export default function AccessibilityDemo() {
  return (
    <div className="mt-10">
      <div className="rounded-2xl border border-line bg-brand-soft/60 px-5 py-4 text-sm text-ink-soft">
        <strong className="text-ink">Tentang demo ini:</strong> pengenalan suara (Web
        Speech API) dan pembacaan teks (Speech Synthesis API) di bawah benar-benar
        berjalan lewat browser Anda. Hasil deteksi kamera bersifat simulasi/placeholder
        — lihat komentar kode untuk arsitektur produksi yang direncanakan.
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <VoiceCommandPanel />
        <CameraSimulationPanel />
      </div>
    </div>
  );
}
