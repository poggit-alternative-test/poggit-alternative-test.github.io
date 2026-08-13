import { Heart } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function Footer() {
  const { colors } = useTheme();

  return (
    <footer
      className="footer-container"
      style={{
        borderTop: `1px solid ${colors.border}`,
        backgroundColor: colors.bg,
        color: colors.textMuted,
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* Left: branding */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: colors.textSecondary }}>
              Axolotl Plugin Registry
            </span>
            <span style={{ fontSize: '12px' }}>
              Powered by{' '}
              <a
                href="https://github.com/axolotl-pm"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: colors.brand, textDecoration: 'none' }}
              >
                axolotl-pm
              </a>
              . Download links point directly to plugin repositories.
            </span>
          </div>

          {/* Right: links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href="https://github.com/axolotl-pm"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: colors.textMuted,
                textDecoration: 'none',
              }}
              aria-label="GitHub"
            >
              <img src="/axolotl-git.svg" alt="" style={{ height: '18px', width: 'auto' }} aria-hidden="true" />
              <span>GitHub</span>
            </a>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
              Built with <Heart size={12} style={{ color: colors.brand }} /> for PocketMine-MP
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
