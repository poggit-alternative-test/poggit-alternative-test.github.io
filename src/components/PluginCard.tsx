import { Link } from 'react-router-dom';
import { Download, AlertCircle } from 'lucide-react';
import type { PluginEntry } from '../types/plugin';
import { CATEGORY_LABELS } from '../types/plugin';
import { Badge } from './Badge';
import { resolveIconUrl } from '../lib/iconResolver';

interface PluginCardProps {
  plugin: PluginEntry;
}

export function PluginCard({ plugin }: PluginCardProps) {
  const iconUrl = resolveIconUrl(plugin);
  const isUnavailable = plugin.unavailable === true;

  return (
    <Link
      to={`/plugins/${encodeURIComponent(plugin.id)}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        borderRadius: '12px',
        border: `1px solid ${isUnavailable ? '#E4E4E7' : 'var(--color-border)'}`,
        padding: '16px',
        backgroundColor: 'var(--color-card)',
        textDecoration: 'none',
        transition: 'all 0.15s ease',
        opacity: isUnavailable ? 0.6 : 1,
      }}
      onMouseEnter={e => {
        if (!isUnavailable) {
          const t = e.currentTarget as HTMLAnchorElement;
          t.style.borderColor = 'var(--color-brand)';
          t.style.transform = 'translateY(-2px)';
          t.style.boxShadow = '0 4px 12px rgba(8, 77, 230, 0.08)';
        }
      }}
      onMouseLeave={e => {
        const t = e.currentTarget as HTMLAnchorElement;
        t.style.borderColor = isUnavailable ? '#E4E4E7' : 'var(--color-border)';
        t.style.transform = 'translateY(0)';
        t.style.boxShadow = 'none';
      }}
    >
      {/* Header row: icon + name + badge */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        {/* Icon */}
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
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
              loading="lazy"
            />
          ) : (
            <span style={{ fontSize: '20px' }} aria-hidden="true">
              🧩
            </span>
          )}
        </div>

        {/* Name + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <span
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {plugin.name}
            </span>
            {isUnavailable && (
              <AlertCircle size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            )}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            by {plugin.author.join(', ')}
          </p>
        </div>
      </div>

      {/* Description */}
      {plugin.description && (
        <p
          style={{
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {plugin.description}
        </p>
      )}

      {/* Footer: badge + category + version */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <Badge tier={plugin.build_tier} />
        <span
          style={{
            borderRadius: '9999px',
            paddingLeft: '8px',
            paddingRight: '8px',
            paddingTop: '2px',
            paddingBottom: '2px',
            fontSize: '11px',
            fontWeight: 500,
            backgroundColor: 'var(--color-card)',
            color: 'var(--color-text-muted)',
            border: '1px solid var(--color-border)',
          }}
        >
          {CATEGORY_LABELS[plugin.category]}
        </span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
          {plugin.tag || `v${plugin.version}`}
        </span>
      </div>

      {/* Download count */}
      {plugin.download_count != null && !isUnavailable && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
          <Download size={13} />
          {plugin.download_count.toLocaleString()} downloads
        </div>
      )}
    </Link>
  );
}
