import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Github, Download, ArrowLeft, AlertCircle, Loader2, ChevronDown, Star } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Badge, FeaturedBadge, ForkBadge } from '@/components/Badge';
import { CATEGORY_LABELS } from '@/types/plugin';
import { resolveIconUrl } from '@/lib/iconResolver';
import { useRegistry } from '@/hooks/useRegistry';
import type { PluginEntry } from '@/types/plugin';

/** Version option shown in the version selector */
interface VersionOption {
  tag: string;
  label: string;
  download_url: string;
  isNightly?: boolean;
}

export function PluginDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { colors } = useTheme();
  const { plugins, loading, error } = useRegistry();
  const [imgError, setImgError] = useState<Record<string, boolean>>({});
  const [showVersionMenu, setShowVersionMenu] = useState(false);

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

  const isUnavailable = plugin.unavailable === true;

  // Build version options: stable releases from all_tags + dev_build as a single list
  const versionOptions: VersionOption[] = [
    ...(plugin.all_tags ?? []).map(tag => ({
      tag,
      label: tag,
      download_url: `https://github.com/${plugin.id}/releases/download/${tag}/${plugin.name}.phar`,
    })),
    ...(plugin.dev_build ? [{
      tag: plugin.dev_build.tag,
      label: `${plugin.dev_build.tag} (Dev)`,
      download_url: plugin.dev_build.download_url,
      isNightly: true,
    }] : []),
  ];

  const currentTag = plugin.tag || plugin.version;
  const currentDownloadUrl = plugin.download_url || `https://github.com/${plugin.id}/releases/latest`;

  const iconUrl = (() => {
    if (imgError[plugin.id]) return null;
    return resolveIconUrl(plugin);
  })();

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
                by {plugin.author.join(', ')} • API {plugin.api.join(', ')}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {plugin.featured && <FeaturedBadge />}
                {plugin.fork && <ForkBadge forkedFrom={plugin.forked_from} />}
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

          {/* Stats: downloads + stars */}
          <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: colors.textPrimary, marginBottom: '16px' }}>
                Stats
              </h2>
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Download size={16} style={{ color: colors.textMuted }} />
                  <span style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: colors.textPrimary,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {(plugin.download_count != null ? plugin.download_count : 0).toLocaleString()}
                  </span>
                  <span style={{ fontSize: '13px', color: colors.textMuted }}>downloads</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={16} style={{ color: colors.textMuted, fill: colors.textMuted }} />
                  <span style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: colors.textPrimary,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {(plugin.stargazers_count >= 0 ? plugin.stargazers_count : 0).toLocaleString()}
                  </span>
                  <span style={{ fontSize: '13px', color: colors.textMuted }}>stars</span>
                </div>
              </div>
            </section>
        </div>

        {/* Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Download button — standalone */}
          {!isUnavailable && (
            <a
              href={currentDownloadUrl}
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
              }}
            >
              <Download size={16} />
              Download {currentTag}
            </a>
          )}

          {/* Version dropdown — separate toggleable section */}
          {versionOptions.length > 1 && (
            <div style={{
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.card,
              overflow: 'hidden',
              borderRadius: '10px',
            }}>
              {/* Toggle button */}
              <button
                onClick={() => setShowVersionMenu(!showVersionMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: colors.textPrimary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: showVersionMenu ? 'none' : `1px solid ${colors.border}`,
                  cursor: 'pointer',
                }}
              >
                <span>RELEASE BUILD</span>
                <ChevronDown
                  size={12}
                  style={{
                    transform: showVersionMenu ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.15s ease',
                  }}
                />
              </button>

              {/* Dropdown options */}
              {showVersionMenu && (
                <div>
                  {versionOptions.map((opt, idx) => (
                    <a
                      key={opt.tag}
                      href={opt.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        fontSize: '13px',
                        color: opt.tag === currentTag ? colors.textPrimary : colors.textSecondary,
                        textDecoration: 'none',
                        borderBottom: idx < versionOptions.length - 1 ? `1px solid ${colors.border}` : 'none',
                        backgroundColor: opt.tag === currentTag ? `${colors.brand}10` : 'transparent',
                      }}
                      onMouseEnter={e => {
                        if (opt.tag !== currentTag) {
                          (e.currentTarget as HTMLElement).style.backgroundColor = colors.border;
                        }
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          opt.tag === currentTag ? `${colors.brand}10` : 'transparent';
                      }}
                    >
                      {/* Left: version tag */}
                      <span style={{ fontFamily: 'monospace' }}>
                        {opt.label}
                      </span>

                      {/* Right: badge + checkmark */}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {opt.isNightly ? (
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            color: '#7C3AED',
                            backgroundColor: '#EDE9FE',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                          }}>
                            nightly
                          </span>
                        ) : opt.tag === currentTag ? (
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            color: '#16A34A',
                            backgroundColor: '#DCFCE7',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                          }}>
                            latest
                          </span>
                        ) : null}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
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
                { label: 'Version', value: plugin.tag || plugin.version },
                { label: 'API', value: plugin.api.join(', ') },
                { label: 'Category', value: CATEGORY_LABELS[plugin.category] },
                { label: 'Authors', value: plugin.author.join(', ') },
                { label: 'Build', value: plugin.build_tier ?? 'unknown' },
                { label: 'Tags', value: `${(plugin.all_tags ?? []).length} submitted` },
                ...(plugin.fork && plugin.forked_from
                  ? [{ label: 'Forked from', value: plugin.forked_from }]
                  : []),
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
