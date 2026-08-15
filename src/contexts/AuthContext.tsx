/**
 * AuthContext — in-memory token storage only.
 *
 * Security contract:
 *  • The access token is held in React state and is NEVER written to
 *    localStorage, sessionStorage, cookies, or any other persisted storage.
 *  • Refreshing the page clears the session (normal for single-page apps).
 *  • Logout clears the token immediately from memory.
 */

import { createContext, useCallback, useContext, useState } from 'react';
import type { GitHubUser } from '@/lib/auth';

/** Authentication status of the current session. */
export type AuthStatus = 'idle' | 'authenticating' | 'authenticated' | 'error';

interface AuthContextValue {
  status: AuthStatus;
  user: GitHubUser | null;
  userLogin: string | null;
  userAvatar: string | null;
  /** Start the GitHub OAuth + PKCE flow (redirects to GitHub) */
  login: () => void;
  /** Called by AuthCallbackPage after successful token exchange */
  setUser: (user: GitHubUser) => void;
  /** Clear the token and user from memory */
  logout: () => void;
  /** Clear the error state and return to idle */
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: JSX.Element }) {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [user, setUserState] = useState<GitHubUser | null>(null);

  const login = useCallback(() => {
    setStatus('authenticating');
    // Dynamically import to keep auth.ts out of the initial bundle until needed.
    import('@/lib/auth').then(({ startOAuthLogin }) => {
      startOAuthLogin();
      // After redirect, AuthCallbackPage handles the response.
      // Set back to idle in case the user cancels before redirecting.
      setStatus('idle');
    }).catch(() => {
      setStatus('error');
    });
  }, []);

  const setUser = useCallback((u: GitHubUser) => {
    setUserState(u);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(() => {
    setUserState(null);
    setStatus('idle');
  }, []);

  const clearError = useCallback(() => {
    setStatus('idle');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        status,
        user,
        userLogin: user?.login ?? null,
        userAvatar: user?.avatar_url ?? null,
        login,
        setUser,
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
