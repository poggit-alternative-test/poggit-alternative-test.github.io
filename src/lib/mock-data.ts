// DEV ONLY — remove or guard with import.meta.env.DEV before Phase 7.
// This file provides realistic mock data so the UI can be developed
// and tested before real registry data exists.

import type { PluginEntry } from '../types/plugin';

export const MOCK_PLUGINS: PluginEntry[] = [
  {
    id: 'cooldogepm/BedrockEconomy',
    name: 'BedrockEconomy',
    version: '4.0.4',
    tag: 'v4.0.4',
    all_tags: ['v4.0.4', 'v4.0.3', 'v4.0.2'],
    dev_build: null,
    api: ['5.0.0'],
    author: ['cooldogepm'],
    description:
      'An extremely customizable Economy plugin designed for scalability and simplicity',
    category: 'economy',
    icon_path: 'icon.png',
    icon_url:
      'https://raw.githubusercontent.com/cooldogepm/BedrockEconomy/HEAD/icon.png',
    repo_url: 'https://github.com/cooldogepm/BedrockEconomy',
    download_url:
      'https://github.com/cooldogepm/BedrockEconomy/releases/download/v4.0.4/BedrockEconomy.phar',
    download_count: 4821,
    build_tier: 'verified',
    attestation_checked_at: '2026-08-11T14:23:00Z',
    approved_at: '2026-06-15T09:00:00Z',
    last_synced_at: '2026-08-12T00:00:00Z',
    unavailable: false,
  },
  {
    id: 'nicholass003/TopStats',
    name: 'TopStats',
    version: '1.0.3',
    tag: 'v1.0.3',
    all_tags: ['v1.0.3', 'v1.0.2'],
    dev_build: null,
    api: ['5.0.0'],
    author: ['nicholass003'],
    description:
      'TopStats plugin for tracking top player statistics for PocketMine-MP.',
    category: 'world',
    icon_path: null,
    icon_url:
      'https://raw.githubusercontent.com/nicholass003/TopStats/HEAD/assets/icon.png',
    repo_url: 'https://github.com/nicholass003/TopStats',
    download_url:
      'https://github.com/nicholass003/TopStats/releases/download/v1.0.3/TopStats.phar',
    download_count: 934,
    build_tier: 'built-via-ci',
    attestation_checked_at: '2026-08-10T08:11:00Z',
    approved_at: '2026-07-22T11:30:00Z',
    last_synced_at: '2026-08-12T00:00:00Z',
    unavailable: false,
  },
  {
    id: 'IvanCraft623/RankSystem',
    name: 'RankSystem',
    version: '1.2.1',
    tag: 'v1.2.1',
    all_tags: ['v1.2.1'],
    dev_build: null,
    api: ['5.36.0'],
    author: ['IvanCraft623'],
    description:
      'An amazing Rank and Permissions Manager. The best ranks manager for PocketMine-MP.',
    category: 'chat',
    icon_path: 'icon.png',
    icon_url:
      'https://raw.githubusercontent.com/IvanCraft623/RankSystem/HEAD/icon.png',
    repo_url: 'https://github.com/IvanCraft623/RankSystem',
    download_url:
      'https://github.com/IvanCraft623/RankSystem/releases/download/v1.2.1/RankSystem.phar',
    download_count: 317,
    build_tier: 'unverified',
    attestation_checked_at: '2026-08-09T19:45:00Z',
    approved_at: '2026-08-01T16:00:00Z',
    last_synced_at: '2026-08-12T00:00:00Z',
    unavailable: false,
  },
  {
    id: 'nicholass003/Textify',
    name: 'Textify',
    version: '0.0.1',
    tag: 'nightly',
    all_tags: ['nightly', 'v0.0.1'],
    dev_build: {
      tag: 'nightly-20240815',
      download_url:
        'https://github.com/nicholass003/Textify/releases/download/nightly-20240815/Textify.phar',
    },
    api: ['5.0.0'],
    author: ['nicholass003'],
    description:
      'A shared virion library providing common utilities for PocketMine plugins. Provides event routing, configuration helpers, and async task scheduling.',
    category: 'api',
    icon_path: null,
    icon_url: null,
    repo_url: 'https://github.com/nicholass003/Textify',
    download_url:
      'https://github.com/nicholass003/Textify/releases/download/nightly-20240815/Textify.phar',
    download_count: 55,
    build_tier: null,
    attestation_checked_at: null,
    approved_at: '2026-08-05T10:00:00Z',
    last_synced_at: '2026-08-12T00:00:00Z',
    unavailable: false,
  },
  {
    id: 'GonePrivate/ClaimPlugin',
    name: 'ClaimPlugin',
    version: '4.1.2',
    tag: 'v4.1.2',
    all_tags: ['v4.1.2'],
    dev_build: null,
    api: ['5.0.0'],
    author: ['SecretDev'],
    description: 'Land claim and anti-grief protection system.',
    category: 'protection',
    icon_path: 'resources/icon.png',
    icon_url:
      'https://raw.githubusercontent.com/GonePrivate/ClaimPlugin/HEAD/resources/icon.png',
    repo_url: 'https://github.com/GonePrivate/ClaimPlugin',
    download_url:
      'https://github.com/GonePrivate/ClaimPlugin/releases/download/v4.1.2/ClaimPlugin.phar',
    download_count: 1205,
    build_tier: 'built-via-ci',
    attestation_checked_at: '2026-08-08T12:00:00Z',
    approved_at: '2026-07-10T08:00:00Z',
    last_synced_at: '2026-08-12T00:00:00Z',
    unavailable: true, // repo was made private after approval
  },
];
