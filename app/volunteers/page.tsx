import { fetchVolunteers } from '@/lib/api';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import VolunteersTable from '../components/VolunteersTable';

export default async function VolunteersPage() {
  const { count, volunteers } = await fetchVolunteers();

  const registered = volunteers.filter((v) => v.name).length;
  const totalTrips = volunteers.reduce((s, v) => s + v.tripCount, 0);
  const mostActive = volunteers.reduce(
    (max, v) => (v.tripCount > max.tripCount ? v : max),
    volunteers[0] ?? { name: null, code: '—', tripCount: 0 },
  );

  return (
    <div className="space-y-8">
      <PageHeader title="Volunteers" subtitle="Everyone contributing commute data" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total volunteers" value={count} accent="violet" />
        <StatCard label="Registered" value={registered} accent="blue" hint="signed up with a name" />
        <StatCard label="Total trips" value={totalTrips} accent="emerald" />
        <StatCard
          label="Most active"
          value={mostActive?.tripCount ?? 0}
          suffix="trips"
          accent="amber"
          hint={mostActive?.name ?? mostActive?.code ?? '—'}
        />
      </div>

      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">All volunteers</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">{count} total</span>
        </div>
        <VolunteersTable volunteers={volunteers} />
      </div>
    </div>
  );
}