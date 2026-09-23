import Card from './Card';
import { ReactNode } from 'react';

export default function EmptyState({
  icon = '📭',
  title,
  message,
  action,
}: {
  icon?: string;
  title: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <Card className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-4xl opacity-60">{icon}</div>
      <div className="mt-3 font-semibold text-gray-800 dark:text-gray-200">{title}</div>
      {message && (
        <div className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">{message}</div>
      )}
      {action && <div className="mt-4">{action}</div>}
    </Card>
  );
}