import VoiceCommandPanel from "@/components/accessibility/VoiceCommandPanel";
import CameraVisionPanel from "@/components/accessibility/CameraVisionPanel";

export default function AccessibilityDemo() {
  return (
    <div className="mt-10">
      <div className="rounded-2xl border border-line bg-brand-soft/60 px-5 py-4 text-sm text-ink-soft">
        <strong className="text-ink">Tentang demo ini:</strong> seluruh panel di bawah
        berjalan sungguhan di browser Anda — pengenalan suara (Web Speech API), pembacaan
        teks (Speech Synthesis API), pencarian produk ke katalog asli, dan pengenalan
        gambar lewat model computer vision MobileNet V2 (TensorFlow.js). Tidak ada API
        eksternal berbayar dan tidak butuh API key.
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <VoiceCommandPanel />
        <CameraVisionPanel />
      </div>
    </div>
  );
}
