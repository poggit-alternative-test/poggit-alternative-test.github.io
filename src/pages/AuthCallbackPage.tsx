import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * /auth — legacy callback route (kept for backward compat).
 *
 * The real OAuth callback is handled in main.tsx before React renders.
 * This page is a fallback/loading state for the /auth path.
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
