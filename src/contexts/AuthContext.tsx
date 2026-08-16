/**
 * AuthContext — in-memory token storage only.
 *
 * Security contract:
 *  • The access token is held in React state and is NEVER written to
 *    localStorage, sessionStorage, cookies, or any other persisted storage.
 *  • Refreshing the page clears the session (normal for single-page apps).
 *  • Logout clears the token immediately from memory.
 */

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { GitHubUser } from '@/lib/auth';

/** Authentication status of the current session */
export type AuthStatus = 'idle' | 'authenticating' | 'authenticated' | 'error';

interface AuthContextValue {
  status: AuthStatus;
  statusMessage: string;
  user: GitHubUser | null;
  userLogin: string | null;
  userAvatar: string | null;
  /** Start the GitHub OAuth + PKCE flow (redirects to GitHub) */
  login: () => void;
  /** Clear the token and user from memory */
  logout: () => void;
  /** Clear the error state and return to idle */
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [user, setUserState] = useState<GitHubUser | null>(null);

  // Guard: only process OAuth callback once (prevents double-invoke in StrictMode)
  const callbackProcessedRef = useRef(false);

  // Handle OAuth callback on mount
  useEffect(() => {
    if (callbackProcessedRef.current) return;
    callbackProcessedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');
    const errorDescription = params.get('error_description');

    // Clear URL params immediately (before any async work)
    if (code || state || error) {
      window.history.replaceState({}, '', '/');
    }

    if (error) {
      setStatus('error');
      setStatusMessage(errorDescription || error);
      return;
    }

    if (code && state) {
      setStatus('authenticating');
      setStatusMessage('Completing sign-in…');

      import('@/lib/auth').then(({ handleOAuthCallback }) => {
        handleOAuthCallback(code, state)
          .then((u) => {
            setUserState(u);
            setStatus('authenticated');
            setStatusMessage('');
          })
          .catch((err) => {
            setStatus('error');
            setStatusMessage(err instanceof Error ? err.message : 'Authentication failed');
          });
      });
    }
  }, []);

  const login = useCallback(() => {
    setStatus('authenticating');
    import('@/lib/auth').then(({ startOAuthLogin }) => {
      startOAuthLogin();
      setStatus('idle');
    }).catch(() => {
      setStatus('error');
      setStatusMessage('Failed to start login');
    });
  }, []);

  const logout = useCallback(() => {
    setUserState(null);
    setStatus('idle');
    setStatusMessage('');
  }, []);

  const clearError = useCallback(() => {
    setStatus('idle');
    setStatusMessage('');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        status,
        statusMessage,
        user,
        userLogin: user?.login ?? null,
        userAvatar: user?.avatar_url ?? null,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
