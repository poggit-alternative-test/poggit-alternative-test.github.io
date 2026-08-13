import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent } from '@/components/ui';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { MOCK_PLUGINS } from '@/lib/mock-data';

export function PluginsPage() {
  const { colors } = useTheme();
  const plugins = MOCK_PLUGINS.filter(p => !p.unavailable);

  return (
    <div className="page-container" style={{ paddingTop: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: colors.textPrimary, marginBottom: '8px' }}>
          All Plugins
        </h1>
        <p style={{ fontSize: '14px', color: colors.textSecondary }}>
          Browse all {plugins.length} registered PocketMine-MP plugins.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {plugins.map(plugin => (
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
    </div>
  );
}
