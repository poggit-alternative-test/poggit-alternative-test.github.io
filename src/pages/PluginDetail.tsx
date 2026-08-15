import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Github, Download, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Badge } from '@/components/Badge';
import { CATEGORY_LABELS } from '@/types/plugin';
import { useRegistry } from '@/hooks/useRegistry';
import type { PluginEntry } from '@/types/plugin';

export function PluginDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { colors } = useTheme();
  const { plugins, loading, error } = useRegistry();
  const [imgError, setImgError] = useState<Record<string, boolean>>({});

  const plugin: PluginEntry | undefined = plugins.find(
    p => decodeURIComponent(slug ?? '') === p.id,
  );

  if (loading) {
    return (
      <div
        className="page-container"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '64px', paddingBottom: '64px' }}
      >
        <Loader2 size={32} style={{ color: colors.brand, animation: 'spin 0.8s linear infinite', marginBottom: '12px' }} />
        <p style={{ color: colors.textMuted, fontSize: '14px' }}>Loading…</p>
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
      <div className="page-container" style={{ paddingTop: '64px', textAlign: 'center' }}>
        <AlertCircle size={40} style={{ color: '#EF4444', marginBottom: '16px' }} />
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: colors.textPrimary, marginBottom: '8px' }}>
          Failed to load
        </h1>
        <p style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '24px' }}>
          {error}
        </p>
        <Link to="/search" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: colors.brand, fontSize: '14px', fontWeight: 500 }}>
          <ArrowLeft size={14} />
          Back to search
        </Link>
      </div>
    );
  }

  if (!plugin) {
    return (
      <div
        className="page-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          paddingTop: '64px',
          paddingBottom: '64px',
        }}
      >
        <AlertCircle size={40} style={{ color: colors.textMuted, marginBottom: '16px' }} />
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: colors.textPrimary, marginBottom: '8px' }}>
          Plugin not found
        </h1>
        <p style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '24px' }}>
          No plugin with ID <code>{slug}</code> was found in the registry.
        </p>
        <Link
          to="/search"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: colors.brand,
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={14} />
          Back to search
        </Link>
      </div>
    );
  }

  const releaseUrl = plugin.download_url || `https://github.com/${plugin.id}/releases/latest`;
  const iconUrl = (() => {
    if (imgError[plugin.id]) return null;
    if (plugin.icon_url) return plugin.icon_url;
    return null;
  })();

  const isUnavailable = plugin.unavailable === true;

  return (
    <div className="page-container" style={{ paddingTop: '32px' }}>
      {/* Back link */}
      <Link
        to="/search"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          color: colors.textMuted,
          textDecoration: 'none',
          marginBottom: '24px',
        }}
      >
        <ArrowLeft size={14} />
        Back to search
      </Link>

      <div className="detail-layout">
        {/* Main content */}
        <div>
          {/* Plugin header */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
              marginBottom: '32px',
              flexWrap: 'wrap',
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '14px',
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.surface,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt={`${plugin.name} icon`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={() => setImgError(e => ({ ...e, [plugin.id]: true }))}
                />
              ) : (
                <span style={{ fontSize: '28px' }} aria-hidden="true">🧩</span>
              )}
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 700, color: colors.textPrimary }}>
                  {plugin.name}
                </h1>
                {isUnavailable && (
                  <span style={{
                    borderRadius: '9999px',
                    padding: '2px 8px',
                    fontSize: '11px',
                    fontWeight: 500,
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    border: '1px solid #FCD34D',
                  }}>
                    Unavailable
                  </span>
                )}
              </div>

              <p style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '8px' }}>
                by {plugin.author.join(', ')} • v{plugin.version} • API {plugin.api.join(', ')}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <Badge tier={plugin.build_tier} />
                <span style={{
                  borderRadius: '9999px',
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: 500,
                  backgroundColor: colors.card,
                  color: colors.textMuted,
                  border: `1px solid ${colors.border}`,
                }}>
                  {CATEGORY_LABELS[plugin.category]}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {plugin.description && (
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: colors.textPrimary, marginBottom: '12px' }}>
                Description
              </h2>
              <p style={{ fontSize: '14px', color: colors.textSecondary, lineHeight: 1.7 }}>
                {plugin.description}
              </p>
            </section>
          )}

          {/* Download stats */}
          {plugin.download_count != null && (
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: colors.textPrimary, marginBottom: '12px' }}>
                Downloads
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={16} style={{ color: colors.textMuted }} />
                <span style={{ fontSize: '20px', fontWeight: 700, color: colors.textPrimary }}>
                  {plugin.download_count.toLocaleString()}
                </span>
                <span style={{ fontSize: '13px', color: colors.textMuted }}>total downloads</span>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Download button */}
          {!isUnavailable && (
            <a
              href={releaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                height: '44px',
                paddingLeft: '20px',
                paddingRight: '20px',
                borderRadius: '10px',
                backgroundColor: colors.brand,
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#0137C1';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = colors.brand;
              }}
            >
              <Download size={16} />
              Download Latest Release
            </a>
          )}

          {/* View on GitHub */}
          <a
            href={plugin.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              height: '44px',
              paddingLeft: '20px',
              paddingRight: '20px',
              borderRadius: '10px',
              backgroundColor: colors.card,
              color: colors.textPrimary,
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              border: `1px solid ${colors.border}`,
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = colors.border;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = colors.card;
            }}
          >
            <Github size={16} />
            View on GitHub
          </a>

          {/* Info card */}
          <div
            style={{
              borderRadius: '12px',
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.card,
              padding: '16px',
            }}
          >
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: colors.textPrimary, marginBottom: '12px' }}>
              Plugin Info
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Version', value: plugin.version },
                { label: 'API', value: plugin.api.join(', ') },
                { label: 'Category', value: CATEGORY_LABELS[plugin.category] },
                { label: 'Authors', value: plugin.author.join(', ') },
                { label: 'Build', value: plugin.build_tier ?? 'unknown' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: colors.textMuted }}>{label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: colors.textSecondary, textAlign: 'right', wordBreak: 'break-word' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
