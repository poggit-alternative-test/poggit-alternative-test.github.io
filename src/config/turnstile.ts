/**
 * Cloudflare Turnstile integration for bot protection.
 *
 * Setup:
 *  1. Sign up at https://dash.cloudflare.com/turnstile
 *  2. Add a site → get SITE_KEY and SECRET_KEY
 *  3. Set secrets in the worker:
 *       npx wrangler secret put TURNSTILE_SECRET_KEY
 *  4. Update TURNSTILE_SITE_KEY below with your key
 *
 * If TURNSTILE_SITE_KEY is empty/placeholder, bot protection is skipped.
 */

export const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
