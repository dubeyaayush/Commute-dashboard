/// Shared display formatters. Import these anywhere instead of redefining.

export function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso));
}

export function fmtTime(iso: string | null): string {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso));
}

export function fmtDuration(min: number | null): string {
  if (min == null) return '—';
  if (min < 1) return `${Math.round(min * 60)}s`;
  return `${min.toFixed(1)} min`;
}

export function fmtSeconds(sec: number): string {
  return sec < 60 ? `${sec}s` : `${(sec / 60).toFixed(1)} min`;
}

export function fmtPct(v: number | null): string {
  return v == null ? '—' : `${Math.round(v * 100)}%`;
}

export function cap(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}