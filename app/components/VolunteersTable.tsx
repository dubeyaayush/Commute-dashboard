import { VolunteerRow } from '@/lib/api';
import { fmtDate } from '@/lib/format';
import EmptyState from './EmptyState';

export default function VolunteersTable({ volunteers }: { volunteers: VolunteerRow[] }) {
  if (volunteers.length === 0) {
    return (
      <EmptyState
        icon="👥"
        title="No volunteers yet"
        message="Volunteers who sign up in the app will appear here."
      />
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80 text-left text-xs uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-400">
            <th className="px-4 py-3 font-medium">Volunteer</th>
            <th className="px-4 py-3 font-medium">Code</th>
            <th className="px-4 py-3 font-medium">City</th>
            <th className="px-4 py-3 font-medium">Joined</th>
            <th className="px-4 py-3 text-right font-medium">Trips</th>
          </tr>
        </thead>
        <tbody>
          {volunteers.map((v) => (
            <tr
              key={v.code}
              className="border-b border-gray-100 last:border-0 transition-colors hover:bg-blue-50/40 dark:border-gray-800 dark:hover:bg-gray-800/40"
            >
              <td className="px-4 py-3 font-medium">
                {v.name ?? (
                  <span className="text-gray-400 italic">Unregistered</span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {v.code}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{v.city ?? '—'}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {v.createdAt ? fmtDate(v.createdAt) : '—'}
              </td>
              <td className="px-4 py-3 text-right">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {v.tripCount}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}