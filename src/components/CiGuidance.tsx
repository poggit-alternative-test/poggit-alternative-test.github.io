import { ExternalLink, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const PMMP_ACTIONS_URL = 'https://github.com/axolotl-pm/pmmp-plugin-actions';

export function CiGuidance({ repoUrl }: { repoUrl: string }) {
  const { colors } = useTheme();

  return (
    <div
      style={{
        borderRadius: '12px',
        border: `1px solid #F59E0B`,
        backgroundColor: '#FFFBEB',
        padding: '16px',
        display: 'flex',
        gap: '14px',
        alignItems: 'flex-start',
      }}
    >
      <AlertTriangle
        size={18}
        style={{ color: '#D97706', flexShrink: 0, marginTop: '1px' }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#92400E',
            margin: '0 0 6px',
          }}
        >
          No stable release with a .phar file found
        </p>
        <p
          style={{
            fontSize: '13px',
            color: '#78350F',
            margin: '0 0 12px',
            lineHeight: 1.5,
          }}
        >
          Your repository must have at least one GitHub Release containing a{' '}
          <code
            style={{
              fontSize: '12px',
              padding: '1px 5px',
              borderRadius: '4px',
              backgroundColor: '#FEF3C7',
            }}
          >
            .phar
          </code>{' '}
          file before it can be submitted. The registry does not build anything
          on your behalf.
        </p>

        <a
          href={PMMP_ACTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            backgroundColor: '#F59E0B',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'opacity 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          Set up CI with pmmp-plugin-actions
          <ExternalLink size={13} />
        </a>

        <p
          style={{
            fontSize: '11px',
            color: '#B45309',
            margin: '10px 0 0',
          }}
        >
          After your first stable release is published, come back here and
          submit again.
        </p>
      </div>
    </div>
  );
}
