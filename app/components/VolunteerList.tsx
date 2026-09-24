import { VolunteerRow } from '@/lib/api';
import VolunteerAccordion from './VolunteerAccordion';
import EmptyState from './EmptyState';

export default function VolunteerList({ volunteers }: { volunteers: VolunteerRow[] }) {
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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {volunteers.map((v) => (
        <VolunteerAccordion key={v.code} volunteer={v} />
      ))}
    </div>
  );
}