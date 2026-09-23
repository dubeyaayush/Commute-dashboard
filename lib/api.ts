// Server-side API client for the admin backend. Runs on the Next.js server, so
// the API key stays out of the browser.

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';
const KEY = process.env.API_KEY ?? '';

// --- shapes returned by the backend (mirrors /admin/trips + /admin/trips/:id) ---

export interface TripSummary {
  trip_id: string;
  volunteer_code: string | null;
  started_at: string | null;
  ended_at: string | null;
  total_minutes: number | null;
  gps_samples: number;
  leg_count: number;
  has_metro_arrival: boolean;
  overall_confidence: number | null;
  quality: string; // ok | sparse | short | empty
  analyzed_at: string | null;
}

export interface JourneyLeg {
  kind: string; // walking | moving | waiting | stopped
  startedAt: string;
  endedAt: string;
  seconds: number;
  medianSpeedKmh: number;
  maxSpeedKmh: number;
  confidence: number | null;
  mode?: {
    label: string; // 'vehicle' | e-rickshaw | car | metro
    lean: string;
    confidence: number;
  };
}

export interface MetroArrival {
  at: string;
  station: string;
  confidence: number;
}

export interface GpsPoint {
  t: string;
  lat: number;
  lng: number;
  speed: number | null;
}

export interface ManualLabel {
  mode: string;
  started_at: string;
  ended_at: string;
  source: string;
}

export interface TripDetail {
  summary: {
    tripId: string;
    volunteerCode: string | null;
    startedAt: string | null;
    endedAt: string | null;
    totalMinutes: number | null;
    gpsSamples: number;
    legCount: number;
    hasMetroArrival: boolean;
    overallConfidence: number | null;
    quality: string;
  };
  journey: {
    legs: JourneyLeg[];
    events: { rideStarts: unknown[]; metroArrivals: MetroArrival[] };
    limitations: string[];
  };
  gpsTrack: GpsPoint[];
  manualLabels: ManualLabel[];
}

// --- fetchers ---

async function get<T>(path: string): Promise<T> {
  if (!BASE) throw new Error('NEXT_PUBLIC_API_BASE is not set');
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'x-api-key': KEY },
    // Always fetch fresh — trip data changes as volunteers upload.
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Backend ${res.status} on ${path}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchTrips(params?: {
  volunteer?: string;
  quality?: string;
  limit?: number;
}): Promise<{ count: number; trips: TripSummary[] }> {
  const q = new URLSearchParams();
  if (params?.volunteer) q.set('volunteer', params.volunteer);
  if (params?.quality) q.set('quality', params.quality);
  if (params?.limit) q.set('limit', String(params.limit));
  const qs = q.toString() ? `?${q.toString()}` : '';
  return get(`/admin/trips${qs}`);
}

export async function fetchTrip(id: string): Promise<TripDetail> {
  return get(`/admin/trips/${encodeURIComponent(id)}`);
}