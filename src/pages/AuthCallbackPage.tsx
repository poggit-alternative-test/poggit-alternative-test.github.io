import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * /auth/callback — placeholder for redirect-based OAuth flows.
 *
 * The device flow (Phase 6) does not use this page — auth completes in the
 * same tab where "Login with GitHub" was clicked.
 *
 * This page exists so the redirect URI can be pre-registered for future
 * Authorization Code + PKCE flows (e.g. for more granular GitHub App permissions).
 *
 * For now it simply redirects home.
 */
export function AuthCallbackPage() {
  const { status } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'authenticated') {
      navigate('/', { replace: true });
    } else if (status === 'idle' || status === 'error') {
      navigate('/login', { replace: true });
    }
  }, [status, navigate]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '16px',
        flexDirection: 'column',
      }}
    >
      {/* Animated dot indicator */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: colors.brand,
              animation: `authBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <p style={{ color: colors.textSecondary, fontSize: '14px', margin: 0 }}>
        Completing sign-in…
      </p>
      <style>{`
        @keyframes authBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
