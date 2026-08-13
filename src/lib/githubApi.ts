/**
 * GitHub API helpers for the submission flow.
 *
 * All functions accept the user's in-memory token — never use a shared token.
 * Rate limit errors are surfaced as typed ApiError so callers can show a
 * specific message without leaking raw HTTP details.
 */

import type { PluginCategory } from '@/types/plugin';

// ── Types ────────────────────────────────────────────────────────────────────

/** A public GitHub repository that may contain a plugin. */
export interface RepoSearchResult {
  id: number;
  full_name: string;
  name: string;
  owner: string;
  description: string | null;
  updated_at: string;
  stargazers_count: number;
  open_issues_count: number;
  archived: boolean;
}

/** Normalised plugin.yml data. */
export interface PluginYml {
  name: string;
  version: string;
  api: string[];
  author: string | null;
  authors: string[];
  description: string;
  main: string | null;
  depend: string[];
  prefix: string | null;
  website: string | null;
  [key: string]: unknown;
}

/** Whether a repo has a stable release with a .phar asset. */
export interface ReleaseInfo {
  tag_name: string;
  name: string;
  html_url: string;
  published_at: string;
  phar_name: string;
  download_url: string;
  asset_id: number;
}

/** API error with a user-facing message. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number | null,
    public readonly userMessage: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ── Generic request helper ────────────────────────────────────────────────────

async function ghFetch<T>(
  url: string,
  token: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...options?.headers,
    },
  });

  if (res.status === 403 && res.headers.get('X-RateLimit-Remaining') === '0') {
    throw new ApiError(
      'GitHub API rate limit exceeded',
      403,
      'GitHub API rate limit exceeded. Please try again in a few minutes.',
    );
  }

  if (res.status === 404) {
    throw new ApiError('Not found', 404, 'Resource not found.');
  }

  if (res.status === 401) {
    throw new ApiError('Unauthorized', 401, 'Authentication failed. Please log in again.');
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new ApiError(
      `GitHub API error: ${res.status} ${res.statusText} — ${body}`,
      res.status,
      `GitHub API error (${res.status}). Please try again.`,
    );
  }

  return res.json() as Promise<T>;
}

// ── Search API ───────────────────────────────────────────────────────────────

interface SearchCodeResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Array<{
    repository: {
      id: number;
      full_name: string;
      name: string;
      owner: { login: string };
      description: string | null;
      updated_at: string;
      stargazers_count: number;
      open_issues_count: number;
      archived: boolean;
    };
  }>;
}

/**
 * Search for the authenticated user's public repos that contain `plugin.yml`.
 * Optionally filters by an additional text query.
 *
 * Uses the GitHub Search API:
 *   GET /search/code?q=filename:plugin.yml is:public user:{username}
 *
 * Archived repos are filtered out (archived plugins are no longer maintained).
 */
export async function searchReposWithPluginYml(
  token: string,
  username: string,
  query?: string,
): Promise<RepoSearchResult[]> {
  const q = [
    'filename:plugin.yml',
    'is:public',
    `user:${username}`,
    'archived:false',
    ...(query ? [query] : []),
  ]
    .join(' ')
    .trim();

  const url = `https://api.github.com/search/code?q=${encodeURIComponent(q)}&per_page=30&sort=updated`;

  const data = await ghFetch<SearchCodeResponse>(url, token);

  if (data.total_count === 0) {
    return [];
  }

  // Deduplicate by repo (the same repo can appear multiple times if it has
  // multiple plugin.yml files — take the most recently updated entry per repo).
  const seen = new Map<string, RepoSearchResult>();
  for (const item of data.items) {
    const repo = item.repository;
    const key = repo.full_name;
    if (!seen.has(key)) {
      seen.set(key, {
        id: repo.id,
        full_name: repo.full_name,
        name: repo.name,
        owner: repo.owner.login,
        description: repo.description,
        updated_at: repo.updated_at,
        stargazers_count: repo.stargazers_count,
        open_issues_count: repo.open_issues_count,
        archived: repo.archived,
      });
    }
  }

  return Array.from(seen.values()).sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );
}

// ── Fetch & parse plugin.yml ────────────────────────────────────────────────

interface ContentsResponse {
  content: string; // base64-encoded
  encoding: string;
  sha: string;
}

/**
 * Fetch and parse `plugin.yml` from the root of a repository.
 * Returns null if the file is missing or unreadable.
 *
 * Parses YAML-like values without a full YAML parser:
 * - Single-line scalar values
 * - Comma-separated inline lists (api: 5.0.0, 5.1.0)
 * - Multi-line YAML lists (indented `-` entries)
 */
export async function fetchPluginYml(
  token: string,
  owner: string,
  repo: string,
): Promise<PluginYml | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/plugin.yml`;
  let raw: ContentsResponse;

  try {
    raw = await ghFetch<ContentsResponse>(url, token);
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) return null;
    throw err;
  }

  const content = atob(raw.content.replace(/\n/g, ''));
  return parsePluginYml(content);
}

/** Parse raw plugin.yml text into a structured PluginYml object. */
export function parsePluginYml(content: string): PluginYml {
  const lines = content.split(/\r?\n/);
  const result: Record<string, unknown> = {};

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Match "key: value" (allowing quoted values)
    const scalarMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_-]*):\s*(.*)$/);
    if (scalarMatch) {
      const [, key, rawValue] = scalarMatch;
      const value = rawValue.trim();

      if (value === '' || value === '|' || value === '>' || value.startsWith('|') || value.startsWith('>')) {
        // Empty or block scalar — check for multi-line list starting on next lines
        if (i + 1 < lines.length && /^\s+-\s/.test(lines[i + 1])) {
          i++;
          const items: string[] = [];
          while (i < lines.length && /^\s+-\s/.test(lines[i])) {
            items.push(lines[i].replace(/^\s+-\s*/, '').trim().replace(/^['"]|['"]$/g, ''));
            i++;
          }
          result[key] = items;
          continue;
        } else {
          result[key] = null;
          i++;
          continue;
        }
      }

      // Inline list: "api: 5.0.0, 4.0.0" or "author: foo, bar"
      if (value.includes(',')) {
        result[key] = value.split(',').map((v) => v.trim().replace(/^['"]|['"]$/g, ''));
      } else {
        // Unquote simple scalars
        result[key] = value.replace(/^['"]|['"]$/g, '');
      }
      i++;
      continue;
    }

    // Multi-line YAML list item (indented - entry, no parent key on this line)
    const listItemMatch = line.match(/^\s+-\s*(.+)$/);
    if (listItemMatch) {
      // If the previous key had no value yet, treat as list continuation
      const lastKey = Object.keys(result).at(-1);
      if (lastKey && Array.isArray(result[lastKey])) {
        (result[lastKey] as string[]).push(listItemMatch[1].trim().replace(/^['"]|['"]$/g, ''));
      }
      i++;
      continue;
    }

    i++;
  }

  const authorRaw = result.author ?? result.authors ?? null;
  const authors: string[] =
    authorRaw === null
      ? []
      : Array.isArray(authorRaw)
      ? authorRaw
      : String(authorRaw)
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean);

  const apiRaw = result.api;
  const api: string[] =
    Array.isArray(apiRaw)
      ? apiRaw
      : typeof apiRaw === 'string' && apiRaw.includes(',')
      ? apiRaw.split(',').map((v) => v.trim())
      : [String(apiRaw ?? '')];

  const dependRaw = result.depend;
  const depend: string[] =
    Array.isArray(dependRaw)
      ? dependRaw
      : typeof dependRaw === 'string' && dependRaw.includes(',')
      ? dependRaw.split(',').map((v) => v.trim())
      : dependRaw
      ? [String(dependRaw)]
      : [];

  return {
    name: String(result.name ?? ''),
    version: String(result.version ?? ''),
    api,
    author: result.author ? String(result.author) : null,
    authors,
    description: String(result.description ?? ''),
    main: result.main ? String(result.main) : null,
    depend,
    prefix: result.prefix ? String(result.prefix) : null,
    website: result.website ? String(result.website) : null,
    ...result,
  } as PluginYml;
}

// ── Check for stable release with .phar ────────────────────────────────────

interface ReleaseAsset {
  id: number;
  name: string;
  browser_download_url: string;
  download_count: number;
}

interface GhRelease {
  tag_name: string;
  name: string | null;
  html_url: string;
  published_at: string;
  assets: ReleaseAsset[];
}

/**
 * Check whether a repository has a stable (non-prerelease) GitHub Release
 * containing at least one `.phar` file.
 *
 * Uses `/releases/latest` — specifically excludes pre-releases.
 * Returns null if no suitable release is found.
 */
export async function checkRelease(
  token: string,
  owner: string,
  repo: string,
): Promise<ReleaseInfo | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;

  let release: GhRelease;
  try {
    release = await ghFetch<GhRelease>(url, token);
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) return null;
    throw err;
  }

  const pharAsset = release.assets.find((a) =>
    a.name.toLowerCase().endsWith('.phar'),
  );

  if (!pharAsset) return null;

  return {
    tag_name: release.tag_name,
    name: release.name ?? release.tag_name,
    html_url: release.html_url,
    published_at: release.published_at,
    phar_name: pharAsset.name,
    download_url: pharAsset.browser_download_url,
    asset_id: pharAsset.id,
  };
}

// ── Validate icon path via Contents API ──────────────────────────────────────

/**
 * Check whether an icon file exists at the given path in the repository.
 * Returns true if the path resolves to a file, false otherwise (404 or empty).
 *
 * Uses a HEAD request — lightweight, no body downloaded.
 */
export async function checkIconPath(
  token: string,
  owner: string,
  repo: string,
  iconPath: string,
): Promise<boolean> {
  const cleanPath = iconPath.replace(/^\//, '').trim();
  if (!cleanPath || cleanPath.includes('..')) return false;

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(cleanPath)}`;

  try {
    const res = await fetch(url, {
      method: 'HEAD',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    if (!res.ok) return false;
    // Check the type field in the JSON response
    const data = await res.json() as { type?: string };
    return data.type === 'file';
  } catch {
    return false;
  }
}

// ── Open submission issue ────────────────────────────────────────────────────

/**
 * Open a structured submission Issue in the registry repository.
 * Uses the markdown body format documented in CONTRIBUTING.md §Issue body format.
 *
 * The registry repo owner/name are read from the VITE_REGISTRY_REPO env var
 * (e.g. "poggit-alternative-test/plugin-registry"). Falls back to the constant
 * below during local development.
 */
export const DEFAULT_REGISTRY_REPO = 'poggit-alternative-test/plugin-registry';
export const REGISTRY_REPO =
  import.meta.env.VITE_REGISTRY_REPO ?? DEFAULT_REGISTRY_REPO;

/**
 * Open a submission issue in the registry repo.
 * Returns the created issue number.
 */
export async function openSubmissionIssue(
  token: string,
  owner: string,
  repo: string,
  category: PluginCategory,
  iconPath: string | null,
  pluginData: PluginYml,
): Promise<number> {
  const iconPathBlock = iconPath
    ? `**Icon Path:** ${iconPath}`
    : '**Icon Path:** *(none — assets/icon.png will be used automatically if present)*';

  const dependBlock =
    pluginData.depend.length > 0
      ? pluginData.depend.map((d) => `- ${d}`).join('\n')
      : '*none*';

  const body = [
    '## Required',
    '',
    `**Repository URL:** https://github.com/${owner}/${repo}`,
    '',
    `**Category:** ${category}`,
    '',
    iconPathBlock,
    '',
    '---',
    '',
    '## plugin.yml reference',
    '',
    '> The fields below are copied from your `plugin.yml` for reviewer',
    '> convenience. They are **re-verified from the repository** automatically',
    '> and cannot be used to override anything.',
    '',
    `**Name:** ${pluginData.name}`,
    `**Version:** ${pluginData.version}`,
    `**API:** ${pluginData.api.join(', ')}`,
    `**Author:** ${pluginData.authors.join(', ') || (pluginData.author ?? '(not specified)')}`,
    `**Description:** ${pluginData.description}`,
    '',
    `**Dependencies:** ${dependBlock}`,
  ].join('\n');

  const [registryOwner, registryName] = REGISTRY_REPO.split('/');

  const issue = await ghFetch<{ number: number }>(
    `https://api.github.com/repos/${registryOwner}/${registryName}/issues`,
    token,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `[Plugin] ${pluginData.name} by ${pluginData.authors.join(', ') || (pluginData.author ?? owner)}`,
        body,
        labels: ['pending'],
      }),
    },
  );

  return issue.number;
}
