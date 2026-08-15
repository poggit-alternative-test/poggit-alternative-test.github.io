/**
 * Icon URL resolver — implements the four-tier fallback.
 *
 * Resolution order:
 *   1. Developer-submitted icon_path  → raw.githubusercontent.com URL
 *   2. icon.png (common convention)   → raw.githubusercontent.com URL
 *   3. assets/icon.png convention     → raw.githubusercontent.com URL
 *   4. Axolotl default icon          → DEFAULT_PLUGIN_ICON constant
 *
 * All URLs use /HEAD/ in place of a branch name so GitHub resolves
 * server-side — no API call needed to look up the default branch.
 *
 * NOTE: This is a synchronous resolver that returns a URL string.
 * It does NOT attempt an HTTP fetch to verify existence — that check
 * is done server-side by the sync workflow (Phase 4). This module
 * only constructs the URL string.
 */

import { DEFAULT_PLUGIN_ICON } from './constants';
import type { PluginEntry } from '../types/plugin';

/**
 * Resolve the best available icon URL for a plugin entry.
 * Returns the URL of the highest-priority available tier.
 *
 * @param plugin - The plugin entry from the registry index
 * @returns The resolved icon URL, or the default icon URL as fallback
 */
export function resolveIconUrl(plugin: PluginEntry): string {
  // Tier 1: explicitly submitted icon_path
  if (plugin.icon_path != null && plugin.icon_path.trim() !== '') {
    const url = buildRawUrl(plugin.id, plugin.icon_path);
    if (url != null) return url;
    // Path was provided but produced an invalid URL — fall through
  }

  // Tier 2: icon.png (first fallback)
  const iconPngUrl = buildRawUrl(plugin.id, 'icon.png');
  if (iconPngUrl != null) return iconPngUrl;

  // Tier 3: assets/icon.png (second fallback)
  const assetsIconUrl = buildRawUrl(plugin.id, 'assets/icon.png');
  if (assetsIconUrl != null) return assetsIconUrl;

  // Tier 4: Axolotl default icon
  return DEFAULT_PLUGIN_ICON;
}

/**
 * Build a raw.githubusercontent.com URL for a given owner/repo and path.
 * Uses /HEAD/ so GitHub resolves to the current default branch automatically.
 *
 * @param id - The plugin id in owner/repo format
 * @param filePath - Relative path within the repo
 * @returns The raw URL, or null if the inputs are invalid
 */
function buildRawUrl(id: string, filePath: string): string | null {
  // id is validated against /^[^\/]+\/[^\/]+$/ by the schema
  const parts = id.split('/');
  if (parts.length !== 2) return null;

  // Sanitise file path: reject any path traversal or absolute URL
  const clean = filePath.trim().replace(/^\//, '');
  if (clean === '' || clean.includes('..') || /^[a-z]+:\/\//i.test(clean)) {
    return null;
  }

  return `https://raw.githubusercontent.com/${parts[0]}/${parts[1]}/HEAD/${clean}`;
}
