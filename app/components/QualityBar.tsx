const COLORS: Record<string, string> = {
  ok: 'bg-emerald-500',
  sparse: 'bg-amber-400',
  short: 'bg-orange-400',
  empty: 'bg-rose-500',
};
const ORDER = ['ok', 'sparse', 'short', 'empty'];

export default function QualityBar({
  counts,
  total,
}: {
  counts: Record<string, number>;
  total: number;
}) {
  if (total === 0) return null;
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Data quality</h3>
        <span className="text-xs text-gray-400">{counts.ok ?? 0} of {total} usable</span>
      </div>
      <div className="flex h-3 overflow-hidden rounded-full bg-gray-100">
        {ORDER.map((q) =>
          counts[q] ? (
            <div
              key={q}
              className={COLORS[q]}
              style={{ width: `${(counts[q] / total) * 100}%` }}
              title={`${q}: ${counts[q]}`}
            />
          ) : null,
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
        {ORDER.map((q) =>
          counts[q] ? (
            <span key={q} className="flex items-center gap-1.5">
              <span className={`inline-block h-2 w-2 rounded-full ${COLORS[q]}`} />
              {q} ({counts[q]})
            </span>
          ) : null,
        )}
      </div>
    </div>
  );
}