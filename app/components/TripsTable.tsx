import Link from 'next/link';
import { TripSummary } from '@/lib/api';
import { fmtDate, fmtDuration } from '@/lib/format';
import QualityBadge from './QualityBadge';
import ConfidenceBar from './ConfidenceBar';
import EmptyState from './EmptyState';

export default function TripsTable({ trips }: { trips: TripSummary[] }) {
  if (trips.length === 0) {
    return (
      <EmptyState
        icon="🗺️"
        title="No trips yet"
        message="Once volunteers record and upload commutes, they'll appear here."
      />
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50/80 text-left text-xs uppercase tracking-wide text-gray-500">
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Volunteer</th>
            <th className="px-4 py-3 font-medium">Duration</th>
            <th className="px-4 py-3 font-medium">Legs</th>
            <th className="px-4 py-3 font-medium">Metro</th>
            <th className="px-4 py-3 font-medium">Confidence</th>
            <th className="px-4 py-3 font-medium">Quality</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((t) => (
            <tr key={t.trip_id} className="border-b last:border-0 transition-colors hover:bg-blue-50/40">
              <td className="px-4 py-3">
                <Link href={`/trips/${t.trip_id}`} className="font-medium text-blue-600 hover:underline">
                  {fmtDate(t.started_at)}
                </Link>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                  {t.volunteer_code ?? '—'}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">{fmtDuration(t.total_minutes)}</td>
              <td className="px-4 py-3 text-gray-700">{t.leg_count}</td>
              <td className="px-4 py-3">{t.has_metro_arrival ? '🚇' : '—'}</td>
              <td className="px-4 py-3"><ConfidenceBar value={t.overall_confidence} /></td>
              <td className="px-4 py-3"><QualityBadge quality={t.quality} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}