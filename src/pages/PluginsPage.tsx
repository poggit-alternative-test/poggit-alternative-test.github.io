import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent } from '@/components/ui';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useRegistry } from '@/hooks/useRegistry';

export function PluginsPage() {
  const { colors } = useTheme();
  const { plugins, loading, error } = useRegistry();

  if (loading) {
    return (
      <div className="page-container" style={{ paddingTop: '32px', textAlign: 'center' }}>
        <Loader2
          size={32}
          style={{
            color: colors.brand,
            animation: 'spin 0.8s linear infinite',
            marginBottom: '12px',
          }}
        />
        <p style={{ color: colors.textMuted, fontSize: '14px' }}>Loading plugins…</p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container" style={{ paddingTop: '32px', textAlign: 'center' }}>
        <p style={{ color: '#EF4444', fontSize: '14px', marginBottom: '8px' }}>
          Failed to load plugins
        </p>
        <p style={{ color: colors.textMuted, fontSize: '13px' }}>{error}</p>
      </div>
    );
  }

  const availablePlugins = plugins.filter(p => !p.unavailable);

  return (
    <div className="page-container" style={{ paddingTop: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: colors.textPrimary, marginBottom: '8px' }}>
          All Plugins
        </h1>
        <p style={{ fontSize: '14px', color: colors.textSecondary }}>
          {availablePlugins.length} registered PocketMine-MP plugin{availablePlugins.length !== 1 ? 's' : ''}.
        </p>
      </div>

      {availablePlugins.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: colors.textMuted }}>
          <p style={{ fontSize: '15px', fontWeight: 500, color: colors.textSecondary, marginBottom: '8px' }}>
            No plugins yet
          </p>
          <p style={{ fontSize: '13px' }}>
            Be the first to{' '}
            <a
              href="https://github.com/poggit-alternative-test/plugin-registry/issues/new?template=submit-plugin.yml"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: colors.brand }}
            >
              submit a plugin
            </a>
            .
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {availablePlugins.map(plugin => (
            <Link
              key={plugin.id}
              to={`/plugins/${encodeURIComponent(plugin.id)}`}
              style={{ textDecoration: 'none' }}
            >
              <Card hover style={{ backgroundColor: colors.card, height: '100%' }}>
                <CardContent>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '15px', fontWeight: 600, color: colors.textPrimary }}>
                        {plugin.name}
                      </span>
                      <ArrowRight size={14} style={{ color: colors.textMuted }} />
                    </div>
                    <p style={{ fontSize: '12px', color: colors.textSecondary, lineHeight: 1.5 }}>
                      {plugin.description ?? 'No description'}
                    </p>
                    <div style={{ fontSize: '11px', color: colors.textMuted }}>
                      by {plugin.author.join(', ')} • v{plugin.version}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
