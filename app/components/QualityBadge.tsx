const STYLES: Record<string, string> = {
  ok: 'bg-emerald-100 text-emerald-800',
  sparse: 'bg-amber-100 text-amber-800',
  short: 'bg-orange-100 text-orange-800',
  empty: 'bg-rose-100 text-rose-800',
};

export default function QualityBadge({ quality }: { quality: string }) {
  const cls = STYLES[quality] ?? 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {quality}
    </span>
  );
}