/**
 * GitHub App configuration.
 *
 * PKCE OAuth 2.0 Authorization Code Flow.
 * Token exchange is proxied through a Cloudflare Worker to avoid CORS issues.
 */
export const GITHUB_CLIENT_ID = 'Ov23liODNd3WGbyrVkfM';

/** GitHub OAuth endpoints */
export const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
export const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
export const GITHUB_API_USER = 'https://api.github.com/user';
export const GITHUB_CALLBACK_URL = 'https://poggit-alternative-test.github.io/';

/** Cloudflare Worker URL — proxies token exchange to avoid CORS */
export const OAUTH_PROXY_URL = 'https://github-oauth-proxy.poggit-alternative.workers.dev';

/** OAuth scopes — least privilege */
export const GITHUB_SCOPES = 'read:user';
