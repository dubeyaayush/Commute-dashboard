import { JourneyLeg, ManualLabel } from '@/lib/api';

/// Fields the fixed engine now adds to each leg. Declared locally so this file
/// compiles whether or not JourneyLeg in lib/api.ts has been widened yet.
type Station = { name: string; distanceM: number };
type EngineLeg = JourneyLeg & {
  stoppedSeconds?: number;
  entryStation?: Station | null;
  exitStation?: Station | null;
};

const KIND_STYLE: Record<string, { label: string; icon: string; color: string }> = {
  walking: { label: 'Walk', icon: '🚶', color: 'text-green-700 dark:text-green-400' },
  waiting: { label: 'Wait', icon: '⏸', color: 'text-amber-700 dark:text-amber-400' },
  moving: { label: 'Road vehicle', icon: '🚗', color: 'text-blue-700 dark:text-blue-400' },
  stopped: { label: 'Stopped', icon: '⏹', color: 'text-gray-600 dark:text-gray-400' },
  metro: { label: 'Metro', icon: '🚇', color: 'text-indigo-700 dark:text-indigo-400' },
};

export function EngineTimeline({ legs }: { legs: JourneyLeg[] }) {
  if (legs.length === 0) return <p className="text-sm text-gray-500">No legs reconstructed.</p>;
  return (
    <ol className="space-y-2">
      {(legs as EngineLeg[]).map((leg, i) => {
        const lean = (leg.mode as { lean?: string } | undefined)?.lean;
        const isMetro = leg.kind === 'moving' && lean === 'metro';
        const style = isMetro
          ? KIND_STYLE.metro
          : KIND_STYLE[leg.kind] ?? { label: leg.kind, icon: '•', color: 'text-gray-700' };

        const leansTag = leg.kind === 'moving' && !isMetro && lean ? ` · leans ${lean}` : '';

        const stations =
          isMetro && (leg.entryStation || leg.exitStation)
            ? `${leg.entryStation?.name ?? '—'} → ${leg.exitStation?.name ?? '—'}`
            : null;

        const stopped =
          leg.stoppedSeconds && leg.stoppedSeconds > 0
            ? ` · incl. ${fmtMin(leg.stoppedSeconds)} stopped`
            : '';

        return (
          <li
            key={i}
            className="flex items-start gap-3 rounded-lg border bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900"
          >
            <span className="text-lg leading-none">{style.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`font-medium ${style.color}`}>
                  {style.label}
                  {leansTag && <span className="font-normal text-gray-400">{leansTag}</span>}
                </span>
                <span className="text-sm text-gray-500">{fmtMin(leg.seconds)}</span>
              </div>

              {stations && (
                <div className="mt-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  {stations}
                </div>
              )}

              <div className="text-xs text-gray-500">
                {fmtTime(leg.startedAt)} → {fmtTime(leg.endedAt)}
                {leg.kind === 'moving' && ` · ${leg.medianSpeedKmh.toFixed(0)} km/h`}
                {leg.confidence != null && ` · ${Math.round(leg.confidence * 100)}% conf`}
                {stopped}
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
        <li
          key={i}
          className="flex items-start gap-3 rounded-lg border bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900"
        >
          <span className="font-medium capitalize">{l.mode}</span>
          <span className="text-xs text-gray-500">
            {fmtTime(l.started_at)} → {fmtTime(l.ended_at)}
          </span>
        </li>
      ))}
    </ol>
  );
}

const fmtMin = (sec: number) => (sec < 60 ? `${sec}s` : `${(sec / 60).toFixed(1)} min`);
function fmtTime(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso));
}