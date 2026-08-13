import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { GitHubIcon } from '@/components/GitHubIcon';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * "Login with GitHub" button when logged out.
 * "Logged in as X" + logout button when authenticated.
 */
export function AuthButton() {
  const { status, userLogin, userAvatar, logout, login } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Authenticated state: show avatar + login + logout button
  if (status === 'authenticated' && userLogin) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Avatar */}
        {userAvatar ? (
          <img
            src={userAvatar}
            alt={userLogin}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: `1px solid ${colors.border}`,
              flexShrink: 0,
            }}
          />
        ) : (
          <User size={20} style={{ color: colors.textMuted, flexShrink: 0 }} />
        )}

        {/* Login name */}
        <span
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: colors.textSecondary,
            maxWidth: '120px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={userLogin}
        >
          {userLogin}
        </span>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '5px 10px',
            borderRadius: '8px',
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.surface,
            color: colors.textSecondary,
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.card;
            e.currentTarget.style.borderColor = colors.textMuted;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.surface;
            e.currentTarget.style.borderColor = colors.border;
          }}
          aria-label="Logout"
        >
          <LogOut size={13} />
          Logout
        </button>
      </div>
    );
  }

  // Authenticating / error states: show a neutral button.
  if (status === 'authenticating' || status === 'error') {
    return (
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '8px',
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.card,
          color: colors.textMuted,
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'default',
        }}
      >
        <span style={{ color: colors.brand }}>●</span>
        {status === 'authenticating' ? 'Connecting…' : 'Auth error'}
      </span>
    );
  }

  // Idle / not authenticated: show login button.
  return (
    <button
      onClick={login}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '7px 14px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: colors.brand,
        color: '#FFFFFF',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'opacity 0.15s ease',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.9';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1';
      }}
      aria-label="Login with GitHub"
    >
      <GitHubIcon size={15} />
      Login with GitHub
    </button>
  );
}
