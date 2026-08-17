export interface Review {
  id: string;
  reviewerName: string;
  text: string;
  rating: number; // 1-5
  postedAt: string; // ISO date, mis. "2026-07-21"
}

export type Verdict = "asli" | "tinjau" | "mencurigakan";

export interface ScoreFactor {
  id: string;
  label: string;
  detail: string;
  weight: number;
  triggered: boolean;
}

export interface ReviewScore {
  reviewId: string;
  authenticityScore: number; // 0-100, makin tinggi makin meyakinkan asli
  verdict: Verdict;
  factors: ScoreFactor[];
}
