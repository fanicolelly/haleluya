import { dummyReviews } from "@/lib/reviews/dummyData";
import { scoreReviews } from "@/lib/reviews/scoring";
import ReviewScoreSummary from "@/components/reviews/ReviewScoreSummary";
import ReviewCard from "@/components/reviews/ReviewCard";

// Titik sambung demo: ganti `dummyReviews` dengan data ulasan asli (array
// Review dari lib/reviews/types.ts) lalu jalankan lewat scoreReviews() —
// ReviewScoreSummary dan ReviewCard di bawah tidak perlu diubah sama sekali.
export default function FakeReviewDemo() {
  const scores = scoreReviews(dummyReviews);

  return (
    <div className="mt-10">
      <div className="rounded-2xl border border-line bg-brand-soft/60 px-5 py-4 text-sm text-ink-soft">
        <strong className="text-ink">Tentang demo ini:</strong> skor di bawah dihasilkan dari
        heuristik sederhana di frontend (lihat{" "}
        <code className="font-mono text-xs">lib/reviews/scoring.ts</code>), bukan model ML
        sungguhan. Versi produksi akan memakai model klasifikasi teks IndoBERT yang
        di-fine-tune, dikombinasikan dengan graph analysis akun (jaringan reviewer, histori
        akun) untuk deteksi yang lebih akurat.
      </div>

      <div className="mt-6">
        <ReviewScoreSummary scores={scores} />
      </div>

      <div className="mt-6 space-y-4">
        {dummyReviews.map((review) => {
          const score = scores.find((s) => s.reviewId === review.id);
          if (!score) return null;
          return <ReviewCard key={review.id} review={review} score={score} />;
        })}
      </div>
    </div>
  );
}
