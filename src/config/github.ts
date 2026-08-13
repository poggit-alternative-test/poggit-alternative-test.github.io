/**
 * GitHub App configuration.
 *
 * Note: App ID and Client ID are public identifiers (OAuth public client).
 * They are safe to commit. Only the Client Secret (not used in Device Flow)
 * must be kept private.
 */
export const GITHUB_APP_ID = '4583852';
export const GITHUB_CLIENT_ID = 'Iv23liA6vrsnFbgUtBfh';

/**
 * GitHub Device Authorization endpoint.
 * See: https://docs.github.com/en/developers/apps/building-github-apps/authorizing-github-apps-with-device-flow
 */
export const GITHUB_DEVICE_CODE_URL = 'https://github.com/login/device/code';
export const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
export const GITHUB_USER_URL = 'https://api.github.com/user';

/** Scope required for read-only plugin submission operations. */
export const GITHUB_SCOPES = 'read:user';
