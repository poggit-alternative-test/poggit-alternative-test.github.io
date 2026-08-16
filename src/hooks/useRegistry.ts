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
          // Sort: featured first (by featured_marked_at descending), then by approved_at descending
          const sorted = (data as PluginEntry[]).sort((a, b) => {
            // Featured plugins first
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;

            // Within featured: sort by featured_marked_at (newest first)
            if (a.featured && b.featured) {
              const aTime = a.featured_marked_at ? new Date(a.featured_marked_at).getTime() : 0;
              const bTime = b.featured_marked_at ? new Date(b.featured_marked_at).getTime() : 0;
              return bTime - aTime;
            }

            // Within non-featured: sort by approved_at (newest first)
            const aTime = new Date(a.approved_at).getTime();
            const bTime = new Date(b.approved_at).getTime();
            return bTime - aTime;
          });

          setPlugins(sorted);
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
