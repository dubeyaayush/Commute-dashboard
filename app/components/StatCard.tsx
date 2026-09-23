export type Accent = 'blue' | 'violet' | 'emerald' | 'amber' | 'rose';

const ACCENTS: Record<Accent, string> = {
  blue: 'from-blue-500 to-blue-600',
  violet: 'from-violet-500 to-violet-600',
  emerald: 'from-emerald-500 to-emerald-600',
  amber: 'from-amber-500 to-amber-600',
  rose: 'from-rose-500 to-rose-600',
};

export default function StatCard({
  label,
  value,
  suffix,
  accent = 'blue',
  hint,
}: {
  label: string;
  value: number | string;
  suffix?: string;
  accent?: Accent;
  hint?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-white p-4 shadow-sm">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${ACCENTS[accent]}`} />
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {suffix && <span className="text-sm text-gray-400">{suffix}</span>}
      </div>
      {hint && <div className="mt-1 text-[11px] text-gray-400">{hint}</div>}
    </div>
  );
}