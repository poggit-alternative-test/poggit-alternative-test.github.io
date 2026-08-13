import { useTheme } from '@/contexts/ThemeContext';
import type { PluginYml } from '@/lib/githubApi';
import type { BuildTier } from '@/types/plugin';

interface PluginPreviewProps {
  pluginData: PluginYml;
  buildTier?: BuildTier | null;
  iconUrl?: string | null;
  showBuildTier?: boolean;
}

function BuildTierBadge({ tier }: { tier: BuildTier | null | undefined }) {
  const { colors } = useTheme();

  if (tier === 'verified') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 8px',
          borderRadius: '999px',
          backgroundColor: '#DCFCE7',
          color: '#15803D',
          fontSize: '11px',
          fontWeight: 600,
        }}
      >
        ✓ Verified build
      </span>
    );
  }

  if (tier === 'built-via-ci') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 8px',
          borderRadius: '999px',
          backgroundColor: '#EFF6FF',
          color: '#1D4ED8',
          fontSize: '11px',
          fontWeight: 600,
        }}
      >
        ⚡ Built via CI
      </span>
    );
  }

  return null;
}

export function PluginPreview({
  pluginData,
  buildTier,
  iconUrl,
  showBuildTier = false,
}: PluginPreviewProps) {
  const { colors } = useTheme();

  const authorDisplay =
    pluginData.authors.length > 0
      ? pluginData.authors.join(', ')
      : pluginData.author ?? 'Unknown author';

  const apiDisplay =
    pluginData.api.length > 0 ? pluginData.api.join(', ') : null;

  return (
    <div
      style={{
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.surface,
        overflow: 'hidden',
      }}
    >
      {/* Header band with icon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: colors.card,
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '10px',
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            overflow: 'hidden',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {iconUrl ? (
            <img
              src={iconUrl}
              alt={`${pluginData.name} icon`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <span style={{ fontSize: '24px' }}>🧩</span>
          )}
        </div>

        {/* Name + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px',
              flexWrap: 'wrap',
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: colors.textPrimary,
                margin: 0,
              }}
            >
              {pluginData.name}
            </h3>
            {showBuildTier && <BuildTierBadge tier={buildTier} />}
          </div>

          <p
            style={{
              fontSize: '13px',
              color: colors.textSecondary,
              margin: '0 0 4px',
            }}
          >
            by {authorDisplay}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: colors.textMuted,
              flexWrap: 'wrap',
            }}
          >
            {pluginData.version && (
              <span>Version {pluginData.version.replace(/^v/, '')}</span>
            )}
            {apiDisplay && (
              <>
                <span>·</span>
                <span>API {apiDisplay}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {pluginData.description && (
        <div style={{ padding: '14px 16px' }}>
          <p
            style={{
              fontSize: '13px',
              color: colors.textSecondary,
              margin: 0,
              lineHeight: 1.6,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {pluginData.description}
          </p>
        </div>
      )}

      {/* Dependencies */}
      {pluginData.depend.length > 0 && (
        <div
          style={{
            padding: '10px 16px',
            borderTop: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: '11px', color: colors.textMuted }}>
            Dependencies:
          </span>
          {pluginData.depend.map((dep) => (
            <code
              key={dep}
              style={{
                fontSize: '11px',
                padding: '1px 6px',
                borderRadius: '4px',
                backgroundColor: colors.card,
                color: colors.textSecondary,
                border: `1px solid ${colors.border}`,
              }}
            >
              {dep}
            </code>
          ))}
        </div>
      )}
    </div>
  );
}
