import { ReactNode } from 'react';

/// The single source of truth for panel styling. Every boxed section uses this,
/// so spacing/border/dark-mode stay consistent everywhere.
export default function Card({
  children,
  className = '',
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 ${
        padded ? 'p-4' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}