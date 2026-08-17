export type ConsistencyVerdict = "konsisten" | "tinjau" | "berubah";

export interface ImageRecord {
  name: string;
  hash: string;
  previewUrl: string;
}

export interface EvidenceRecord {
  id: string;
  beforeImage: ImageRecord;
  afterImage: ImageRecord;
  consistencyScore: number; // 0-100, makin tinggi makin konsisten
  pixelDifferencePercent: number;
  hashHammingDistance: number;
  hashTotalBits: number;
  timestamp: string; // ISO
  verdict: ConsistencyVerdict;
}

export function classifyVerdict(consistencyScore: number): ConsistencyVerdict {
  if (consistencyScore >= 80) return "konsisten";
  if (consistencyScore >= 55) return "tinjau";
  return "berubah";
}
