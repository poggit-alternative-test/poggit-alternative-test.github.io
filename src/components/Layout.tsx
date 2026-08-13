import { Link, Outlet } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

export function Layout() {
  const { resolvedMode, setMode } = useTheme();

  const cycleTheme = () => {
    if (resolvedMode === 'dark') setMode('light');
    else if (resolvedMode === 'light') setMode('dark');
    else setMode('dark');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[var(--color-border-current)] bg-[var(--color-bg)]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
          {/* Logo / wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2 text-[var(--color-text-h)]"
            aria-label="Axolotl Plugin Registry home"
          >
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-[var(--color-brand)]"
              aria-hidden="true"
            >
              <ellipse cx="16" cy="20" rx="10" ry="7" fill="currentColor" opacity="0.2" />
              <ellipse cx="16" cy="18" rx="8" ry="6" fill="currentColor" opacity="0.5" />
              <ellipse cx="16" cy="16" rx="6" ry="5" fill="currentColor" />
              <path d="M7 13 Q5 10 6 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M9 12 Q8 9 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M25 13 Q27 10 26 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M23 12 Q24 9 23 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <circle cx="13" cy="15" r="1.5" fill="white" />
              <circle cx="19" cy="15" r="1.5" fill="white" />
              <circle cx="13.3" cy="15.3" r="0.8" fill="#09090B" />
              <circle cx="19.3" cy="15.3" r="0.8" fill="#09090B" />
            </svg>
            <span className="text-base font-semibold tracking-tight">
              Axolotl Plugins
            </span>
          </Link>

          <nav className="ml-auto flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-medium text-[var(--color-muted-current)] transition-colors hover:text-[var(--color-text-h)]"
            >
              Browse
            </Link>

            {/* Theme toggle */}
            <button
              onClick={cycleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted-current)] transition-colors hover:bg-slate-100 hover:text-[var(--color-text-h)] dark:hover:bg-slate-800"
              aria-label={`Theme: ${resolvedMode}. Click to change.`}
            >
              {resolvedMode === 'dark' ? (
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM3.636 3.364a.75.75 0 0 1 0 1.06L2.28 5.78a.75.75 0 1 1-1.06-1.06l1.366-1.366a.75.75 0 0 1 1.06 0ZM1.5 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H2.25A.75.75 0 0 1 1.5 8Zm2.636-.636a.75.75 0 0 1 1.06 0l1.366 1.366a.75.75 0 0 1-1.06 1.06L4.18 8.39a.75.75 0 0 1 0-1.06ZM8 14.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 8 14.5Zm3.364-2.636a.75.75 0 0 1 0-1.06l1.366-1.366a.75.75 0 0 1 1.06 1.06l-1.366 1.366a.75.75 0 0 1-1.06 0ZM14.5 8a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 14.5 8Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.78 12.53a.75.75 0 0 1-.22.53l-1.94 1.94a.75.75 0 1 1-1.06-1.06l1.94-1.94a.75.75 0 0 1 .53-.22h1.72a.75.75 0 0 1 0 1.5H6.25a.75.75 0 0 1-.75-.75v-1.72a.75.75 0 0 1 1.5 0v1.72a.75.75 0 0 1 .22-.53ZM13.5 4A6 6 0 0 0 6.03 6.03 6 6 0 0 0 6.03 13.5 6 6 0 0 0 10 10a6 6 0 0 0 3.5-6ZM8 10a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-current)] py-6 text-center text-xs text-[var(--color-muted-current)]">
        <p>
          Axolotl Plugin Registry — powered by{' '}
          <a
            href="https://github.com/axolotl-pm"
            className="underline hover:text-[var(--color-brand)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            axolotl-pm
          </a>
          . Download links point directly to plugin repositories — no files are hosted here.
        </p>
      </footer>
    </div>
  );
}
