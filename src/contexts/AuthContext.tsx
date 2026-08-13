/**
 * AuthContext — in-memory token storage only.
 *
 * Security contract:
 *  • The access token is held in React state and is NEVER written to
 *    localStorage, sessionStorage, cookies, or any other persisted storage.
 *  • Refreshing the page clears the session (normal for single-page apps).
 *  • Logout clears the token immediately from memory.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { fetchGitHubUser, type GitHubUser } from '@/lib/auth';

/** Authentication status of the current session. */
export type AuthStatus = 'idle' | 'authenticating' | 'authenticated' | 'error';

interface AuthContextValue {
  /** 'idle' | 'authenticating' | 'authenticated' | 'error' */
  status: AuthStatus;
  /** Human-readable status message for UI feedback */
  statusMessage: string;
  /** Current GitHub user, null when not authenticated */
  user: GitHubUser | null;
  /** Short login name, e.g. "octocat" */
  userLogin: string | null;
  /** Avatar URL */
  userAvatar: string | null;
  /** The raw access token — kept in memory only */
  token: string | null;
  /** Start the GitHub device flow and store the resulting token */
  login: () => void;
  /** Clear the token and user from memory */
  logout: () => void;
  /** Clear the error state and return to idle */
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: JSX.Element }) {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Store token ref for use in callbacks without re-creating them on token change.
  const tokenRef = useRef<string | null>(null);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const login = useCallback(() => {
    // Dynamically import to keep auth.ts out of the initial bundle until needed.
    import('@/lib/auth').then(async ({ initiateDeviceFlow, pollForToken, fetchGitHubUser }) => {
      setStatus('authenticating');
      setStatusMessage('Connecting to GitHub…');

      try {
        const { deviceCodeResponse, codeVerifier } = await initiateDeviceFlow();

        setStatusMessage(`Go to ${deviceCodeResponse.verification_uri} and enter code: ${deviceCodeResponse.user_code}`);

        // Open GitHub's device login page automatically.
        window.open(deviceCodeResponse.verification_uri, '_blank', 'noopener,noreferrer');

        const tokenResponse = await pollForToken(
          deviceCodeResponse.device_code,
          codeVerifier,
          deviceCodeResponse.interval,
          (progStatus, userCode) => {
            if (progStatus === 'waiting') {
              setStatusMessage('Waiting for authorization… (keep the GitHub page open)');
            } else if (progStatus === 'slow_down') {
              setStatusMessage('Please wait, checking again shortly…');
            }
          },
        );

        setToken(tokenResponse.access_token);
        tokenRef.current = tokenResponse.access_token;

        const userProfile = await fetchGitHubUser(tokenResponse.access_token);
        setUser(userProfile);
        setStatus('authenticated');
        setStatusMessage('');

        // Clear the code verifier from sessionStorage if it was stored there.
        sessionStorage.removeItem('gh_code_verifier');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Authentication failed';
        setStatus('error');
        setStatusMessage(message);
        setToken(null);
        tokenRef.current = null;
      }
    });
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    tokenRef.current = null;
    setUser(null);
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
        token,
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
