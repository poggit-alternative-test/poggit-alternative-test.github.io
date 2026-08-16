/**
 * GitHub OAuth 2.0 Authorization Code + PKCE flow.
 *
 * Flow:
 *  1. startOAuthLogin() → generates verifier + challenge + state → redirects to GitHub
 *  2. GitHub redirects back to /?code=...&state=...
 *  3. handleOAuthCallback(code, state) → worker proxy → GitHub token → user
 *
 * The token exchange goes through a Cloudflare Worker to avoid CORS issues
 * (GitHub's token endpoint doesn't support CORS).
 *
 * Security contract:
 *  • PKCE verifier only in sessionStorage (ephemeral, cleared on tab close)
 *  • State parameter for CSRF protection
 *  • Token in React state only (never localStorage)
 *  • No client secret in frontend
 */

import {
  GITHUB_CLIENT_ID,
  GITHUB_OAUTH_URL,
  GITHUB_API_USER,
  GITHUB_CALLBACK_URL,
  OAUTH_PROXY_URL,
  GITHUB_SCOPES,
} from '@/config/github';
import { generateCodeVerifier, generateCodeChallenge, generateState } from './pkce';

/** Normalised GitHub user profile */
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  html_url: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  error?: string;
  error_description?: string;
}

// ── Step 1: redirect to GitHub ────────────────────────────────────────────────

/**
 * Redirect the browser to GitHub's OAuth authorization page.
 */
export async function startOAuthLogin(): Promise<void> {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  const state = generateState();

  sessionStorage.setItem('oauth_verifier', verifier);
  sessionStorage.setItem('oauth_state', state);

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_CALLBACK_URL,
    scope: GITHUB_SCOPES,
    response_type: 'code',
    code_challenge: challenge,
    code_challenge_method: 'S256',
    state,
  });

  window.location.href = `${GITHUB_OAUTH_URL}?${params}`;
}

// ── Step 2: exchange code for token ──────────────────────────────────────────

/**
 * Exchange the authorization code for an access token via the Cloudflare Worker proxy.
 * Includes the Turnstile token for bot protection.
 */
async function exchangeCodeForToken(code: string, verifier: string): Promise<TokenResponse> {
  const turnstileToken = sessionStorage.getItem('turnstile_token');

  const body: Record<string, string> = {
    code,
    verifier,
    redirect_uri: GITHUB_CALLBACK_URL,
  };
  if (turnstileToken) {
    body.turnstile_token = turnstileToken;
    sessionStorage.removeItem('turnstile_token');
  }

  const res = await fetch(`${OAUTH_PROXY_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (res.status === 403) {
    throw new Error('Verification failed. Please refresh and try again.');
  }

  return res.json() as Promise<TokenResponse>;
}

// ── Step 3: handle callback ───────────────────────────────────────────────────

/**
 * Handle the OAuth callback — validate state, exchange code for token, return user.
 */
export async function handleOAuthCallback(
  code: string,
  state: string
): Promise<GitHubUser> {
  // 1. Validate state (CSRF protection)
  const storedState = sessionStorage.getItem('oauth_state');
  const storedVerifier = sessionStorage.getItem('oauth_verifier');
  sessionStorage.removeItem('oauth_state');
  sessionStorage.removeItem('oauth_verifier');

  if (!state || state !== storedState) {
    throw new Error('OAuth state mismatch (CSRF protection)');
  }
  if (!storedVerifier) {
    throw new Error('Missing PKCE verifier — session may have expired');
  }

  // 2. Exchange code for token via proxy
  const tokenData = await exchangeCodeForToken(code, storedVerifier);

  if (tokenData.error) {
    throw new Error(`OAuth error: ${tokenData.error_description || tokenData.error}`);
  }

  const accessToken = tokenData.access_token;
  if (!accessToken) {
    throw new Error('No access token received');
  }

  // 3. Fetch user info
  const userRes = await fetch(GITHUB_API_USER, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!userRes.ok) {
    throw new Error('Failed to fetch user info');
  }

  return userRes.json() as Promise<GitHubUser>;
}
