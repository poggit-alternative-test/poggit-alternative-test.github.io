/**
 * Plugin entry type — mirrors schema/plugin-entry.schema.json.
 * All plugin.yml-derived fields are re-fetched and overwritten by the
 * sync workflow on every run; never trusted from a submission body.
 */
export interface PluginEntry {
  /** GitHub owner/repo slug — stable unique identifier */
  id: string;

  /** Plugin name, sourced from plugin.yml name field on every sync */
  name: string;

  /** Latest version string from the most recent GitHub Release tag */
  version: string;

  /** PocketMine API version strings, from plugin.yml api field */
  api: string[];

  /** Author strings, from plugin.yml author/authors field */
  author: string[];

  /** Plugin description, from plugin.yml description field */
  description: string;

  /** Axolotl-defined category, approved by a maintainer */
  category: PluginCategory;

  /**
   * Relative path to the icon file inside the plugin's repo, as submitted.
   * Null means no explicit path was submitted — the sync workflow will
   * attempt the assets/icon.png convention path as the first fallback.
   */
  icon_path: string | null;

  /**
   * Resolved raw.githubusercontent.com URL for the icon.
   * Uses the three-tier fallback: submitted path → assets/icon.png → Axolotl default.
   * Null only if the registry's own default icon also failed to resolve.
   */
  icon_url: string | null;

  /** Direct GitHub URL to the plugin repository */
  repo_url: string;

  /**
   * URL pointing to the .phar asset on the GitHub Releases page.
   * Always originates from the plugin's own repo, never proxied.
   */
  download_url: string;

  /** Total GitHub Release asset download count, null if unavailable */
  download_count: number | null;

  /** Badge tier, null if the check has never run or the release is unavailable */
  build_tier: BuildTier;

  /**
   * ISO 8601 timestamp when the attestation check last ran.
   * Null if the check has never run or the release is unavailable.
   */
  attestation_checked_at: string | null;

  /** ISO 8601 timestamp when a maintainer first approved this entry */
  approved_at: string;

  /** ISO 8601 timestamp when any field was last refreshed by the sync workflow */
  last_synced_at: string;

  /**
   * True if the plugin's repo went private, its release was removed,
   * or the .phar asset is otherwise inaccessible.
   */
  unavailable?: boolean;
}

/** All accepted category values */
export type PluginCategory =
  | 'admin'
  | 'economy'
  | 'chat'
  | 'world'
  | 'protection'
  | 'gameplay'
  | 'fun'
  | 'api'
  | 'tools'
  | 'misc';

/** Build tier / badge values */
export type BuildTier = 'verified' | 'built-via-ci' | 'unverified' | null;

/** Human-readable label for each category */
export const CATEGORY_LABELS: Record<PluginCategory, string> = {
  admin: 'Administration',
  economy: 'Economy',
  chat: 'Chat',
  world: 'World',
  protection: 'Protection',
  gameplay: 'Gameplay',
  fun: 'Fun',
  api: 'API / Library',
  tools: 'Tools',
  misc: 'Miscellaneous',
};

/** All category values as a list — useful for dropdowns */
export const ALL_CATEGORIES: PluginCategory[] = [
  'admin',
  'economy',
  'chat',
  'world',
  'protection',
  'gameplay',
  'fun',
  'api',
  'tools',
  'misc',
];

/** Canonical type — see src/lib/auth.ts */
