import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleOAuthCallback } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * /auth/callback — handles the OAuth redirect from GitHub.
 *
 * Reads ?code= and &state= from the URL, validates the state (CSRF),
 * exchanges the code for a token, and sets the authenticated user.
 */
export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    if (!code || !state) {
      navigate('/login?error=missing_params', { replace: true });
      return;
    }

    handleOAuthCallback(code, state)
      .then((user) => {
        setUser(user);
        navigate('/', { replace: true });
      })
      .catch((err) => {
        console.error('OAuth failed:', err);
        navigate('/login?error=auth_failed', { replace: true });
      });
  }, [searchParams, navigate, setUser]);

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
