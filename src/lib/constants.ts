/**
 * Application-wide constants.
 */

/**
 * URL to Axolotl's own default plugin icon.
 * Used as the final fallback in the three-tier icon resolution chain
 * (submitted icon_path → assets/icon.png → this constant).
 */
export const DEFAULT_PLUGIN_ICON =
  'https://raw.githubusercontent.com/poggit-alternative-test/poggit-alternative-test.github.io/HEAD/public/default-plugin.svg';

/**
 * Path to the site logo SVG (header nav logo).
 */
export const SITE_LOGO = '/axolotl-logo.svg';

/**
 * Path to the GitHub attribution SVG (footer GitHub link).
 */
export const GIT_LOGO = '/axolotl-git.svg';

/**
 * The GitHub org / repo that holds data/index.json.
 */
export const REGISTRY_REPO = 'poggit-alternative-test/plugin-registry';

/**
 * Base URL for raw content from the registry repo.
 * Uses /HEAD/ — GitHub resolves this to the default branch server-side.
 */
export const REGISTRY_RAW_BASE =
  'https://raw.githubusercontent.com/poggit-alternative-test/plugin-registry/HEAD';

/**
 * URL for the plugin index JSON.
 */
export const REGISTRY_INDEX_URL = `${REGISTRY_RAW_BASE}/data/index.json`;
