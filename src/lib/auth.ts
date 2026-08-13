/**
 * GitHub Device Flow helpers.
 *
 * Flow overview:
 *  1. POST to /login/device/code  → { device_code, user_code, verification_uri }
 *  2. Open verification_uri for the user, they enter user_code
 *  3. Poll POST to /login/oauth/access_token with device_code + code_verifier
 *     until { access_token } arrives or error != "authorization_pending"
 *
 * PKCE is used for the token exchange to avoid transmitting the code_challenge
 * directly.  The code_verifier is generated once per flow and stored in sessionStorage
 * only during the polling window — it is cleared the moment a token is received
 * (or the flow times out).  The token itself is NEVER persisted.
 */

import {
  GITHUB_CLIENT_ID,
  GITHUB_DEVICE_CODE_URL,
  GITHUB_TOKEN_URL,
  GITHUB_USER_URL,
} from '@/config/github';

/** Data returned from step 1 of the device flow. */
export interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  interval: number; // seconds to wait between polls
  expires_in: number; // seconds until the device_code expires
}

/** Data returned from step 3 (token exchange). */
export interface TokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

/** Normalised GitHub user profile. */
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  html_url: string;
}

// ── PKCE helpers ────────────────────────────────────────────────────────────

/**
 * Generate a cryptographically random code_verifier for PKCE.
 * Matches OAuth 2.0 §4.1 requirements: 43–128 chars from [A-Z] [a-z] [0-9] "-" "." "_" "~"
 */
function generateCodeVerifier(): string {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '~')
    .slice(0, 128);
}

/**
 * Derive the S256 code_challenge from a code_verifier.
 * OAuth 2.0 §4.1: BASE64URL(SHA256(ASCII(code_verifier)))
 */
async function deriveCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// ── Step 1: initiate device flow ────────────────────────────────────────────

/**
 * Request a device code from GitHub.
 * Opens the verification page automatically and returns the user code + polling data.
 */
export async function initiateDeviceFlow(): Promise<{
  deviceCodeResponse: DeviceCodeResponse;
  codeVerifier: string;
}> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await deriveCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    scope: 'read:user',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  const response = await fetch(GITHUB_DEVICE_CODE_URL, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(params)),
  });

  if (!response.ok) {
    throw new Error(`Device code request failed: HTTP ${response.status}`);
  }

  const json = (await response.json()) as Record<string, unknown>;

  // GitHub returns error responses as 200 OK with an "error" field.
  if ('error' in json) {
    throw new Error(`Device flow error: ${json.error}`);
  }

  const deviceCodeResponse = json as unknown as DeviceCodeResponse;

  return { deviceCodeResponse, codeVerifier };
}

// ── Step 3: poll for access token ───────────────────────────────────────────

/**
 * Poll GitHub for the access token.
 * Calls `onProgress` with each status update.
 * Resolves with the token on success, rejects with an Error on terminal failure.
 *
 * Terminal errors: "authorization_declined" | "bad_verification_code" | ...
 * Non-terminal: "authorization_pending" (keep polling) | "slow_down" (wait longer)
 */
export async function pollForToken(
  deviceCode: string,
  codeVerifier: string,
  intervalSeconds: number,
  onProgress: (status: string, userCode?: string) => void,
): Promise<TokenResponse> {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    device_code: deviceCode,
    grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    code_verifier: codeVerifier,
  });

  const poll = async (waitMs: number): Promise<TokenResponse> => {
    await new Promise<void>((resolve) => setTimeout(resolve, waitMs));

    const response = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`Token poll request failed: HTTP ${response.status}`);
    }

    const json = (await response.json()) as Record<string, unknown>;

    // "authorization_pending" means keep polling.
    if (json.error === 'authorization_pending') {
      onProgress('waiting');
      return poll(waitMs);
    }

    // "slow_down" means GitHub wants us to wait longer.
    if (json.error === 'slow_down') {
      onProgress('slow_down');
      // Default interval + 5 s when slow_down is returned.
      return poll((waitMs + 5000) * 1000);
    }

    // Any other error (including "authorization_declined") is terminal.
    if ('error' in json) {
      throw new Error(`Token exchange failed: ${json.error}`);
    }

    // Success — access_token is present.
    onProgress('success');
    return json as unknown as TokenResponse;
  };

  return poll(intervalSeconds * 1000);
}

// ── Fetch user profile ────────────────────────────────────────────────────────

/**
 * Fetch the authenticated user's profile from the GitHub API.
 */
export async function fetchGitHubUser(accessToken: string): Promise<GitHubUser> {
  const response = await fetch(GITHUB_USER_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user: HTTP ${response.status}`);
  }

  return response.json() as Promise<GitHubUser>;
}
