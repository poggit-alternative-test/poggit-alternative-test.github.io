import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitHubIcon } from '@/components/GitHubIcon';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { TURNSTILE_SITE_KEY } from '@/config/turnstile';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'invisible';
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

/**
 * /login — entry point for GitHub OAuth authentication.
 * Protected by Cloudflare Turnstile (invisible bot check).
 */
export function LoginPage() {
  const { status, statusMessage, login } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();
  const turnstileRef = useRef<string | null>(null);
  const scriptLoadedRef = useRef(false);

  // Once authenticated, redirect home.
  useEffect(() => {
    if (status === 'authenticated') {
      navigate('/', { replace: true });
    }
  }, [status, navigate]);

  // Load Turnstile script once (only if configured)
  useEffect(() => {
    if (scriptLoadedRef.current || !TURNSTILE_SITE_KEY) return;
    scriptLoadedRef.current = true;

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  // Render Turnstile widget after script loads (only if configured)
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !window.turnstile) return;

    const widgetId = window.turnstile.render('#turnstile-container', {
      sitekey: TURNSTILE_SITE_KEY,
      callback: (token: string) => {
        // Store token for the login flow
        sessionStorage.setItem('turnstile_token', token);
      },
      'error-callback': () => {
        sessionStorage.removeItem('turnstile_token');
      },
      theme: colors.bg === '#09090B' ? 'dark' : 'light',
      size: 'invisible',
    });

    turnstileRef.current = widgetId;
    return () => {
      if (turnstileRef.current && window.turnstile) {
        window.turnstile.remove(turnstileRef.current);
      }
    };
  }, [colors]);

  const handleLogin = () => {
    // Verify Turnstile token exists before starting OAuth
    if (TURNSTILE_SITE_KEY) {
      const turnstileToken = sessionStorage.getItem('turnstile_token');
      if (!turnstileToken) {
        alert('Verification failed. Please refresh and try again.');
        return;
      }
    }
    login();
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
        {/* Turnstile widget container (invisible, only if configured) */}
        {!!TURNSTILE_SITE_KEY && (
          <div id="turnstile-container" style={{ minHeight: '65px' }} />
        )}

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

        {/* Error */}
        {status === 'error' && (
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
            {statusMessage || 'Authentication failed. Please try again.'}
          </div>
        )}

        {/* Auth button */}
        {status !== 'authenticated' && (
          <button
            onClick={handleLogin}
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
