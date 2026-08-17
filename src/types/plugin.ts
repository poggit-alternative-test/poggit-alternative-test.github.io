/**
 * Plugin entry type — mirrors schema/plugin-entry.schema.json.
 * All plugin.yml-derived fields are re-fetched and overwritten by the
 * sync workflow on every run; never trusted from a submission body.
 *
 * Versioning:
 * - `tag` is the full Git tag (e.g. "v1.2.0" or "nightly"), includes any "v" prefix.
 * - `version` is the tag stripped of the leading "v" (e.g. "1.2.0").
 * - `all_tags` lists all submitted stable release tags (newest first), managed
 *   by the approval workflow only — the sync workflow never modifies it.
 * - `dev_build` holds the nightly build info when tag === "nightly"; only set
 *   by the approval workflow — the sync workflow never modifies it.
 */
export interface PluginEntry {
  /** GitHub owner/repo slug — stable unique identifier */
  id: string;

  /** Plugin name, sourced from plugin.yml name field on every sync */
  name: string;

  /** Version string from the most recent GitHub Release tag (stripped of leading 'v') */
  version: string;

  /** Full Git tag of the latest approved release (e.g. "v1.2.0" or "nightly") */
  tag: string;

  /**
   * All submitted stable release tags in chronological order (newest first).
   * Only includes tags that were submitted via the approval workflow.
   * The sync workflow never modifies this field.
   */
  all_tags: string[];

  /**
   * Latest dev/nightly build info. Only populated when tag === "nightly".
   * Set by the approval workflow; the sync workflow never modifies it.
   */
  dev_build: {
    /** The nightly build tag (e.g. "nightly-20240815") */
    tag: string;
    /** URL to the nightly .phar asset */
    download_url: string;
  } | null;

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
   * attempt icon.png then assets/icon.png as fallbacks.
   */
  icon_path: string | null;

  /**
   * Resolved raw.githubusercontent.com URL for the icon.
   * Uses the four-tier fallback: submitted path → icon.png → assets/icon.png
   * → Axolotl default. Null only if all four tiers failed.
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

  /**
   * Cumulative download count across all stable releases submitted and approved.
   * Useful for showing total plugin popularity regardless of version.
   */
  download_total: number | null;

  /** GitHub repository star count, defaults to 0 if not available */
  stargazers_count: number;

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

  /** True if this plugin is featured. Featured plugins are sorted to the top. */
  featured: boolean;

  /** ISO 8601 timestamp when the featured label was added. */
  featured_marked_at: string | null;

  /** User-submitted keywords for search. */
  keywords: string[];

  /** True if this plugin was submitted from a fork. */
  fork: boolean;

  /** The original repository this plugin was forked from. */
  forked_from: string | null;
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
export type BuildTier = 'verified' | 'unverified' | null;

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
