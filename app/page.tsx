import { fetchTrips } from '@/lib/api';
import { computeStats } from '@/lib/stats';
import PageHeader from './components/PageHeader';
import StatGrid from './components/StatGrid';
import QualityBar from './components/QualityBar';
import TripsTable from './components/TripsTable';

export default async function DashboardPage() {
  const { count, trips } = await fetchTrips({ limit: 500 });
  const stats = computeStats(trips, count);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="Commute data collected across all volunteers"
      />
      <StatGrid stats={stats} />
      <QualityBar counts={stats.quality} total={stats.total} />
      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">All trips</h2>
          <span className="text-sm text-gray-500">{count} total</span>
        </div>
        <TripsTable trips={trips} />
      </div>
    </div>
  );
}