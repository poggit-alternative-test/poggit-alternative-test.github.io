/**
 * GitHub App configuration.
 *
 * PKCE OAuth 2.0 Authorization Code Flow for GitHub OAuth App.
 * Safe: no client secret in frontend, PKCE verifier in sessionStorage only.
 *
 * Callback URL is the root because GitHub Pages SPA can't serve a sub-path
 * (all routes serve index.html, so /auth/callback would 404).
 */
export const GITHUB_APP_ID = '4583852';
export const GITHUB_CLIENT_ID = 'Iv23liA6vrsnFbgUtBfh';

/** GitHub OAuth endpoints */
export const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
export const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
export const GITHUB_API_USER = 'https://api.github.com/user';
export const GITHUB_CALLBACK_URL = 'https://poggit-alternative-test.github.io/';

/** OAuth scopes — least privilege */
export const GITHUB_SCOPES = 'read:user repo';
