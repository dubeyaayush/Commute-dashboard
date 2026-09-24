import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchTrip } from '@/lib/api';
import { fmtDate, fmtDuration, fmtPct } from '@/lib/format';
import Card from '../../components/Card';
import Section from '../../components/Section';
import QualityBadge from '../../components/QualityBadge';
import TripMap from './TripMap';
import { EngineTimeline, ManualTimeline } from './Timeline';

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let trip;
  try {
    trip = await fetchTrip(id);
  } catch {
    notFound();
  }

  const s = trip.summary;
  const arrivals = trip.journey.events?.metroArrivals ?? [];

  return (
    <div className="space-y-6">
      {/* breadcrumb + title */}
      <div>
        <Link href="/" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
          ← All trips
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold">{fmtDate(s.startedAt)}</h1>
          {s.volunteerName && (
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {s.volunteerName}
            </span>
          )}
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {s.volunteerCode ?? '—'}
          </span>
          <QualityBadge quality={s.quality} />
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Trip {s.tripId}</p>
      </div>

      {/* stat strip */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Duration" value={fmtDuration(s.totalMinutes)} />
        <MiniStat label="Legs" value={String(s.legCount)} />
        <MiniStat label="GPS points" value={String(s.gpsSamples)} />
        <MiniStat label="Avg confidence" value={fmtPct(s.overallConfidence)} />
      </div>

      {/* map */}
      <Section title="Route">
        <Card padded={false} className="overflow-hidden">
          <TripMap track={trip.gpsTrack} />
        </Card>
      </Section>

      {/* metro arrivals (only if any) */}
      {arrivals.length > 0 && (
        <Section title="Metro arrivals">
          <div className="space-y-2">
            {arrivals.map((a, i) => (
              <Card key={i} className="flex items-center justify-between">
                <span className="font-medium">🚇 {a.station}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(a.confidence * 100)}% confidence
                </span>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* two timelines side by side */}
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Engine reconstruction">
          <EngineTimeline legs={trip.journey.legs} />
        </Section>
        <Section title="Volunteer labels">
          <ManualTimeline labels={trip.manualLabels} />
        </Section>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </Card>
  );
}