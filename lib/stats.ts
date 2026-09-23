import { TripSummary } from './api';

export interface DashboardStats {
  total: number;
  volunteers: number;
  totalHours: string;
  avgConfidence: number;
  flagged: number;
  quality: Record<string, number>;
}

/// Compute the top-line dashboard stats from a set of trips.
export function computeStats(trips: TripSummary[], total: number): DashboardStats {
  const volunteers = new Set(trips.map((t) => t.volunteer_code).filter(Boolean)).size;
  const totalMinutes = trips.reduce((s, t) => s + (t.total_minutes ?? 0), 0);
  const confs = trips
    .map((t) => t.overall_confidence)
    .filter((c): c is number => c != null);
  const avgConfidence = confs.length
    ? Math.round((confs.reduce((a, b) => a + b, 0) / confs.length) * 100)
    : 0;
  const quality: Record<string, number> = {};
  for (const t of trips) quality[t.quality] = (quality[t.quality] ?? 0) + 1;
  const flagged = (quality.sparse ?? 0) + (quality.short ?? 0) + (quality.empty ?? 0);

  return {
    total,
    volunteers,
    totalHours: (totalMinutes / 60).toFixed(1),
    avgConfidence,
    flagged,
    quality,
  };
}