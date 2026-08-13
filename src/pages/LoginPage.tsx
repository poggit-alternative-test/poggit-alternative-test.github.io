import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitHubIcon } from '@/components/GitHubIcon';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * /login — dedicated entry point for GitHub authentication.
 * Shows status updates while the device flow is in progress.
 */
export function LoginPage() {
  const { status, statusMessage, login } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();

  // Once authenticated, redirect home.
  useEffect(() => {
    if (status === 'authenticated') {
      navigate('/', { replace: true });
    }
  }, [status, navigate]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '32px',
        padding: '40px 20px',
      }}
    >
      {/* Heading */}
      <div style={{ textAlign: 'center' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: colors.textPrimary,
            margin: '0 0 8px',
          }}
        >
          Sign in to Axolotl
        </h1>
        <p style={{ fontSize: '15px', color: colors.textSecondary, margin: 0 }}>
          Log in with your GitHub account to submit plugins.
        </p>
      </div>

      {/* Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          borderRadius: '16px',
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.surface,
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        {/* Status message */}
        {statusMessage && (
          <div
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: colors.card,
              border: `1px solid ${colors.border}`,
              fontSize: '13px',
              color: colors.textSecondary,
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            {statusMessage}
          </div>
        )}

        {/* Auth button */}
        {status !== 'authenticated' && (
          <button
            onClick={login}
            disabled={status === 'authenticating'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: colors.brand,
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: 600,
              cursor: status === 'authenticating' ? 'default' : 'pointer',
              opacity: status === 'authenticating' ? 0.7 : 1,
              transition: 'opacity 0.15s ease',
              width: '100%',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              if (status !== 'authenticating') {
                e.currentTarget.style.opacity = '0.9';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = status === 'authenticating' ? '0.7' : '1';
            }}
          >
            <GitHubIcon size={18} />
            {status === 'authenticating' ? 'Connecting…' : 'Login with GitHub'}
          </button>
        )}

        {/* Error */}
        {status === 'error' && (
          <p
            style={{
              fontSize: '13px',
              color: '#DC2626',
              textAlign: 'center',
              margin: 0,
            }}
          >
            {statusMessage || 'Authentication failed. Please try again.'}
          </p>
        )}
      </div>

      {/* Privacy note */}
      <p
        style={{
          fontSize: '12px',
          color: colors.textMuted,
          textAlign: 'center',
          maxWidth: '320px',
          lineHeight: 1.6,
        }}
      >
        Your GitHub token is stored in memory only and is cleared when you close
        or refresh this tab. We only request <code style={{ fontSize: '11px' }}>read:user</code>.
      </p>
    </div>
  );
}
