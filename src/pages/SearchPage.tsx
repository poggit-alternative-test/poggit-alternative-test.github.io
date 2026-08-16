import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { PluginCard } from '@/components/PluginCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import type { PluginCategory } from '@/types/plugin';
import { useRegistry } from '@/hooks/useRegistry';

export function SearchPage() {
  const { colors } = useTheme();
  const { plugins, loading, error } = useRegistry();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [selectedCategory, setSelectedCategory] = useState<PluginCategory | 'all'>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return plugins.filter(p => {
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.author.some(a => a.toLowerCase().includes(query.toLowerCase())) ||
        p.keywords?.some(k => k.toLowerCase().includes(query.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesQuery && matchesCategory && !p.unavailable;
    });
  }, [plugins, query, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(q => {
      if (query) q.set('q', query);
      else q.delete('q');
      return q;
    });
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setMobileFiltersOpen(false);
    setSearchParams({});
  };

  const hasCategoryFilter = selectedCategory !== 'all';

  return (
    <div className="page-container" style={{ paddingTop: '32px' }}>
      {/* Search bar — always visible at top of page on ALL screen sizes */}
      <form onSubmit={handleSearch} style={{ marginBottom: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '10px',
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.surface,
            padding: '0 12px',
          }}
        >
          <Search size={16} style={{ color: colors.textMuted, flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search plugins..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: colors.textPrimary,
              fontSize: '14px',
              padding: '10px 0',
            }}
          />
        </div>
      </form>

      {/* Loading / error */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <Loader2
            size={24}
            style={{ color: colors.brand, animation: 'spin 0.8s linear infinite', marginBottom: '8px' }}
          />
          <p style={{ fontSize: '13px', color: colors.textMuted }}>Loading plugins…</p>
        </div>
      )}

      {error && !loading && (
        <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2', marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', color: '#991B1B' }}>
            Failed to load plugins: {error}
          </p>
        </div>
      )}

      {!loading && (
        <>
          {/* Mobile filter toggle */}
          <div className="hide-on-tablet" style={{ marginBottom: mobileFiltersOpen ? '24px' : '0' }}>
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '10px 16px',
                borderRadius: '10px',
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.surface,
                color: colors.textPrimary,
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {mobileFiltersOpen ? <X size={16} /> : <SlidersHorizontal size={16} />}
              {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
              {hasCategoryFilter && (
                <span
                  style={{
                    marginLeft: 'auto',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: colors.brand,
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  1
                </span>
              )}
            </button>
          </div>

          <div className="search-layout">
            {/* Sidebar */}
            <aside
              className={`search-sidebar${mobileFiltersOpen ? ' mobile-open' : ''}`}
              style={{
                display: mobileFiltersOpen ? 'flex' : undefined,
                flexDirection: 'column',
                gap: '24px',
                position: mobileFiltersOpen ? 'static' : undefined,
              }}
            >
              <div>
                <h3 style={{ fontSize: '12px', fontWeight: 600, color: colors.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Category
                </h3>
                <CategoryFilter
                  selected={selectedCategory}
                  onChange={setSelectedCategory}
                />
              </div>
            </aside>

            {/* Results */}
            <div>
              <div style={{ fontSize: '13px', color: colors.textMuted, marginBottom: '16px' }}>
                <span style={{ fontWeight: 600, color: colors.textSecondary }}>{filtered.length}</span>
                {' '}plugin{filtered.length !== 1 ? 's' : ''} found
              </div>

              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 0', color: colors.textMuted }}>
                  <p style={{ fontSize: '15px', fontWeight: 500, color: colors.textSecondary, marginBottom: '8px' }}>
                    No plugins found
                  </p>
                  <p style={{ fontSize: '13px' }}>
                    {query ? `No results for "${query}"` : 'No plugins in this category yet.'}
                  </p>
                  {(query || hasCategoryFilter) && (
                    <button
                      onClick={clearFilters}
                      style={{
                        marginTop: '16px',
                        fontSize: '13px',
                        color: colors.brand,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="plugin-grid">
                  {filtered.map(plugin => (
                    <PluginCard key={plugin.id} plugin={plugin} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
