import { JourneyLeg, ManualLabel } from '@/lib/api';

const KIND_STYLE: Record<string, { label: string; icon: string; color: string }> = {
  walking: { label: 'Walking', icon: '🚶', color: 'text-green-700' },
  waiting: { label: 'Waiting', icon: '⏸', color: 'text-amber-700' },
  moving: { label: 'Vehicle', icon: '🚗', color: 'text-blue-700' },
  stopped: { label: 'Stopped', icon: '⏹', color: 'text-gray-600' },
};

export function EngineTimeline({ legs }: { legs: JourneyLeg[] }) {
  if (legs.length === 0) return <p className="text-sm text-gray-500">No legs reconstructed.</p>;
  return (
    <ol className="space-y-2">
      {legs.map((leg, i) => {
        const s = KIND_STYLE[leg.kind] ?? { label: leg.kind, icon: '•', color: 'text-gray-700' };
        const title =
          leg.kind === 'moving' && leg.mode
            ? leg.mode.label === 'vehicle'
              ? `Vehicle (leaning ${leg.mode.lean})`
              : cap(leg.mode.label)
            : s.label;
        return (
          <li key={i} className="flex items-start gap-3 rounded-lg border bg-white px-3 py-2">
            <span className="text-lg leading-none">{s.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`font-medium ${s.color}`}>{title}</span>
                <span className="text-sm text-gray-500">{fmtMin(leg.seconds)}</span>
              </div>
              <div className="text-xs text-gray-500">
                {fmtTime(leg.startedAt)} → {fmtTime(leg.endedAt)}
                {leg.kind === 'moving' && ` · ${leg.medianSpeedKmh.toFixed(0)} km/h`}
                {leg.confidence != null && ` · ${Math.round(leg.confidence * 100)}% conf`}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function ManualTimeline({ labels }: { labels: ManualLabel[] }) {
  if (labels.length === 0) return <p className="text-sm text-gray-500">No manual labels.</p>;
  return (
    <ol className="space-y-2">
      {labels.map((l, i) => (
        <li key={i} className="flex items-start gap-3 rounded-lg border bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
          <span className="font-medium capitalize">{l.mode}</span>
          <span className="text-xs text-gray-500">
            {fmtTime(l.started_at)} → {fmtTime(l.ended_at)}
          </span>
        </li>
      ))}
    </ol>
  );
}

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const fmtMin = (sec: number) => (sec < 60 ? `${sec}s` : `${(sec / 60).toFixed(1)} min`);
function fmtTime(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso));
}