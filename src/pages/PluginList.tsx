import { useMemo, useState } from 'react';
import type { PluginEntry, PluginCategory } from '../types/plugin';
import { PluginCard } from '../components/PluginCard';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';

interface PluginListProps {
  plugins: PluginEntry[];
}

export function PluginList({ plugins }: PluginListProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<PluginCategory | 'all'>('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return plugins.filter((p) => {
      // Exclude unavailable plugins from the browse list
      if (p.unavailable) return false;

      if (category && p.category !== category) return false;

      if (q) {
        return (
          p.name.toLowerCase().includes(q) ||
          p.author.some((a) => a.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [plugins, category, search]);

  const availableCount = plugins.filter((p) => !p.unavailable).length;

  return (
    <section>
      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-h)] sm:text-3xl">
          Browse Plugins
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted-current)]">
          {availableCount} plugin{availableCount !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter selected={category} onChange={setCategory} />
        {(search || category !== 'all') && (
          <button
            onClick={() => { setSearch(''); setCategory('all'); }}
            className="rounded-lg border border-[var(--color-border-current)] px-3 py-2 text-sm text-[var(--color-muted-current)] transition-colors hover:border-slate-300 hover:text-[var(--color-text-h)] dark:hover:border-slate-600"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Plugin grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <span className="text-4xl" aria-hidden="true">
            🔍
          </span>
          <p className="text-[var(--color-muted-current)]">
            {plugins.length === 0
              ? 'No plugins in the registry yet.'
              : 'No plugins match your search.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((plugin) => (
            <PluginCard key={plugin.id} plugin={plugin} />
          ))}
        </div>
      )}
    </section>
  );
}
