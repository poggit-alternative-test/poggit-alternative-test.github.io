/**
 * Fetch and cache the plugin registry index from GitHub.
 *
 * Uses /HEAD/ so GitHub resolves the default branch server-side —
 * no API call needed to look up the branch name.
 */

import { useState, useEffect } from 'react';
import type { PluginEntry } from '@/types/plugin';
import { REGISTRY_INDEX_URL } from '@/lib/constants';

interface UseRegistryResult {
  plugins: PluginEntry[];
  loading: boolean;
  error: string | null;
}

export function useRegistry(): UseRegistryResult {
  const [plugins, setPlugins] = useState<PluginEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchPlugins = async () => {
      try {
        const response = await fetch(REGISTRY_INDEX_URL);

        if (!response.ok) {
          throw new Error(`Failed to fetch registry (HTTP ${response.status})`);
        }

        const data = await response.json();
        // data/index.json is a flat array of entries.
        if (!Array.isArray(data)) {
          throw new Error('Invalid registry data format');
        }

        if (!cancelled) {
          setPlugins(data as PluginEntry[]);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Failed to load plugin registry';
          setError(message);
          setPlugins([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPlugins();

    return () => {
      cancelled = true;
    };
  }, []);

  return { plugins, loading, error };
}
