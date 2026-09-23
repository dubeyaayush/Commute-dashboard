import StatCard from './StatCard';
import { DashboardStats } from '@/lib/stats';

export default function StatGrid({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      <StatCard label="Total trips" value={stats.total} accent="blue" />
      <StatCard label="Volunteers" value={stats.volunteers} accent="violet" />
      <StatCard label="Total recorded" value={stats.totalHours} suffix="hrs" accent="emerald" />
      <StatCard label="Avg confidence" value={stats.avgConfidence} suffix="%" accent="amber" />
      <StatCard label="Flagged trips" value={stats.flagged} accent="rose" hint="sparse / short / empty" />
    </div>
  );
}