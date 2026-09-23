'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Dashboard', icon: '▦' },
  { href: '/trips', label: 'Trips', icon: '≡' },
  { href: '/volunteers', label: 'Volunteers', icon: '☺' }, // page comes later
];

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <aside className="hidden md:flex md:w-56 md:flex-col md:fixed md:inset-y-0 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="px-5 py-5">
        <div className="text-base font-bold text-gray-900 dark:text-gray-100">
          Commute
        </div>
        <div className="text-xs text-gray-400">Intelligence · Admin</div>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              isActive(item.href)
                ? 'bg-blue-50 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            <span className="text-base leading-none opacity-70">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="px-3 pb-4">
        <ThemeToggle />
      </div>
    </aside>
  );
}

function ThemeToggle() {
  const toggle = () => {
    const el = document.documentElement;
    const dark = el.classList.toggle('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  };
  return (
    <button
      onClick={toggle}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
    >
      <span className="text-base leading-none opacity-70">◐</span>
      Theme
    </button>
  );
}