'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TripSummary, VolunteerRow } from '@/lib/api';
import { fmtDate, fmtDuration } from '@/lib/format';
import QualityBadge from './QualityBadge';

export default function VolunteerAccordion({ volunteer }: { volunteer: VolunteerRow }) {
  const [open, setOpen] = useState(false);
  const [trips, setTrips] = useState<TripSummary[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    const next = !open;
    setOpen(next);
    // Lazy-load trips the first time this row is opened.
    if (next && trips === null && !loading) {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/trips?volunteer=${encodeURIComponent(volunteer.code)}`,
        );
        if (!res.ok) throw new Error(`Failed (${res.status})`);
        const data = await res.json();
        setTrips(data.trips ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load trips');
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="border-b border-gray-100 last:border-0 dark:border-gray-800">
      {/* header row (clickable) */}
      <button
        onClick={toggle}
        className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-blue-50/40 dark:hover:bg-gray-800/40"
      >
        <span
          className={`text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`}
        >
          ▶
        </span>
        <div className="flex flex-1 flex-col">
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {volunteer.name ?? <span className="italic text-gray-400">Unregistered</span>}
          </span>
          <span className="text-xs text-gray-400">{volunteer.code}</span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{volunteer.city ?? '—'}</span>
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          {volunteer.tripCount} trip{volunteer.tripCount === 1 ? '' : 's'}
        </span>
      </button>

      {/* expanded body */}
      {open && (
        <div className="bg-gray-50/60 px-4 pb-3 dark:bg-gray-950/40">
          {loading && <div className="py-3 text-sm text-gray-500">Loading trips…</div>}
          {error && <div className="py-3 text-sm text-red-600">{error}</div>}
          {trips && trips.length === 0 && (
            <div className="py-3 text-sm text-gray-500">No trips recorded.</div>
          )}
          {trips && trips.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400 dark:border-gray-800">
                    <th className="px-3 py-2 font-medium">Date</th>
                    <th className="px-3 py-2 font-medium">Duration</th>
                    <th className="px-3 py-2 font-medium">Legs</th>
                    <th className="px-3 py-2 font-medium">Quality</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((t) => (
                    <tr
                      key={t.trip_id}
                      className="border-b border-gray-50 last:border-0 dark:border-gray-800/60"
                    >
                      <td className="px-3 py-2">
                        <Link
                          href={`/trips/${t.trip_id}`}
                          className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {fmtDate(t.started_at)}
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                        {fmtDuration(t.total_minutes)}
                      </td>
                      <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                        {t.leg_count}
                      </td>
                      <td className="px-3 py-2">
                        <QualityBadge quality={t.quality} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}