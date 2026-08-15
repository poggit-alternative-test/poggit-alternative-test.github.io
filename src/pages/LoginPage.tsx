import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GitHubIcon } from '@/components/GitHubIcon';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * /login — entry point for GitHub OAuth authentication.
 */
export function LoginPage() {
  const { status, login } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Once authenticated, redirect home.
  useEffect(() => {
    if (status === 'authenticated') {
      navigate('/', { replace: true });
    }
  }, [status, navigate]);

  const error = searchParams.get('error');
  const errorMessages: Record<string, string> = {
    auth_failed: 'Authentication failed. Please try again.',
    missing_params: 'Authentication was interrupted. Please try again.',
    state_mismatch: 'Security check failed. Please try again.',
  };

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
        {/* Error */}
        {error && (
          <div
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              fontSize: '13px',
              color: '#991B1B',
              textAlign: 'center',
            }}
          >
            {errorMessages[error] ?? 'Authentication failed. Please try again.'}
          </div>
        )}

        {/* Auth button */}
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
          {status === 'authenticating' ? 'Redirecting…' : 'Login with GitHub'}
        </button>
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
