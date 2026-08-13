/**
 * Submission state machine.
 *
 * State transitions:
 *
 *   idle ──search──▶ searching ──done──▶ idle (no results)
 *   idle ──search──▶ searching ──select──▶ selected
 *   selected ──validate──▶ validating ──error──▶ selected (with error)
 *   selected ──validate──▶ validating ──ready──▶ ready
 *   ready ──submit──▶ submitting ──done──▶ done
 *   ready ──submit──▶ submitting ──error──▶ error
 *   done / error ──reset──▶ idle
 *
 * All API calls use the user's in-memory token from AuthContext.
 */

import { useCallback, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type {
  PluginYml,
  RepoSearchResult,
  ReleaseInfo,
} from '@/lib/githubApi';
import type { PluginCategory } from '@/types/plugin';

// ── State types ─────────────────────────────────────────────────────────────

export type SubmissionStage =
  | 'idle'         // No repo selected, user can search
  | 'searching'    // Search in progress
  | 'selected'     // Repo selected, not yet validated
  | 'validating'   // Checking plugin.yml + release
  | 'ready'        // All checks passed, form filled, ready to submit
  | 'submitting'   // Issue being opened
  | 'done'         // Submission successful
  | 'error';       // Terminal error (rate limit, network, etc.)

export interface SubmissionState {
  stage: SubmissionStage;
  // Search results
  repos: RepoSearchResult[];
  searchQuery: string;
  // Selected repo
  selectedRepo: RepoSearchResult | null;
  // Parsed plugin data
  pluginData: PluginYml | null;
  // Release info
  releaseInfo: ReleaseInfo | null;
  // Form values
  category: PluginCategory | '';
  iconPath: string;
  iconPathValid: boolean | null; // null = not yet checked
  // Submission result
  issueNumber: number | null;
  // Error
  errorMessage: string | null;
  // Abort controller for in-flight requests
  abortController: AbortController | null;
}

// ── Initial state ────────────────────────────────────────────────────────────

const initialState: SubmissionState = {
  stage: 'idle',
  repos: [],
  searchQuery: '',
  selectedRepo: null,
  pluginData: null,
  releaseInfo: null,
  category: '',
  iconPath: '',
  iconPathValid: null,
  issueNumber: null,
  errorMessage: null,
  abortController: null,
};

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useSubmission() {
  const { token, userLogin } = useAuth();
  const [state, setState] = useState<SubmissionState>(initialState);
  const abortRef = useRef<AbortController | null>(null);

  /** Cancel any in-flight requests and reset to a clean stage. */
  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  /** Search for the user's repos containing plugin.yml. */
  const search = useCallback(
    async (query: string) => {
      if (!token || !userLogin) return;

      abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState((prev) => ({
        ...initialState,
        stage: 'searching',
        searchQuery: query,
        abortController: controller,
      }));

      try {
        const { searchReposWithPluginYml, ApiError } = await import('@/lib/githubApi');

        const repos = await searchReposWithPluginYml(token, userLogin, query || undefined);

        if (controller.signal.aborted) return;

        setState((prev) => ({
          ...prev,
          stage: repos.length === 0 ? 'idle' : 'idle',
          repos,
          // Keep repos in list so the UI can show "no results found"
        }));

        // If no repos, set error message for empty state
        if (repos.length === 0) {
          setState((prev) => ({
            ...prev,
            errorMessage:
              query.trim()
                ? `No repositories matching "${query}" found.`
                : 'No public repositories with plugin.yml found.',
          }));
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        if (err instanceof (await import('@/lib/githubApi')).ApiError) {
          setState((prev) => ({
            ...prev,
            stage: 'error',
            errorMessage: err.userMessage,
          }));
        } else if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        } else {
          setState((prev) => ({
            ...prev,
            stage: 'error',
            errorMessage: 'Network error. Please check your connection and try again.',
          }));
        }
      }
    },
    [token, userLogin, abort],
  );

  /** Select a repo and start validation (fetch plugin.yml + check release). */
  const selectRepo = useCallback(
    async (repo: RepoSearchResult) => {
      if (!token) return;

      abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState((prev) => ({
        ...prev,
        stage: 'validating',
        selectedRepo: repo,
        pluginData: null,
        releaseInfo: null,
        category: '',
        iconPath: '',
        iconPathValid: null,
        issueNumber: null,
        errorMessage: null,
        abortController: controller,
      }));

      try {
        const { fetchPluginYml, checkRelease, ApiError } = await import('@/lib/githubApi');

        // Run plugin.yml fetch and release check in parallel.
        const [pluginData, releaseInfo] = await Promise.all([
          fetchPluginYml(token, repo.owner, repo.name),
          checkRelease(token, repo.owner, repo.name),
        ]);

        if (controller.signal.aborted) return;

        if (!pluginData) {
          // Repo doesn't have a readable plugin.yml — shouldn't happen since
          // the search only returns repos with plugin.yml, but handle gracefully.
          setState((prev) => ({
            ...prev,
            stage: 'error',
            errorMessage: 'plugin.yml could not be read from this repository.',
          }));
          return;
        }

        if (!releaseInfo) {
          // No stable release with .phar — proceed to "selected" state with a
          // non-blocking warning. User sees CI guidance and submit is disabled.
          setState((prev) => ({
            ...prev,
            stage: 'selected',
            pluginData,
            releaseInfo: null,
          }));
          return;
        }

        // All checks passed — advance to "ready".
        setState((prev) => ({
          ...prev,
          stage: 'ready',
          pluginData,
          releaseInfo,
        }));
      } catch (err) {
        if (controller.signal.aborted) return;
        if (err instanceof (await import('@/lib/githubApi')).ApiError) {
          setState((prev) => ({
            ...prev,
            stage: 'error',
            errorMessage: err.userMessage,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            stage: 'error',
            errorMessage: 'Network error. Please check your connection and try again.',
          }));
        }
      }
    },
    [token, abort],
  );

  /** Go back to repo selection after selecting a repo. */
  const deselectRepo = useCallback(() => {
    abort();
    setState((prev) => ({
      ...initialState,
      repos: prev.repos, // keep search results
      searchQuery: prev.searchQuery,
    }));
  }, [abort]);

  /** Update the icon path and optionally validate it. */
  const setIconPath = useCallback(
    async (path: string) => {
      setState((prev) => ({ ...prev, iconPath: path, iconPathValid: null }));

      if (!path.trim() || !state.selectedRepo || !token) {
        setState((prev) => ({ ...prev, iconPathValid: null }));
        return;
      }

      const { checkIconPath } = await import('@/lib/githubApi');
      const valid = await checkIconPath(
        token,
        state.selectedRepo.owner,
        state.selectedRepo.name,
        path,
      );
      setState((prev) => ({ ...prev, iconPathValid: valid }));
    },
    [token, state.selectedRepo],
  );

  /** Update the selected category. */
  const setCategory = useCallback((category: PluginCategory | '') => {
    setState((prev) => ({ ...prev, category }));
  }, []);

  /** Submit the issue to the registry repo. */
  const submit = useCallback(async () => {
    if (!token || !state.selectedRepo || !state.pluginData || !state.category) return;
    if (!state.releaseInfo) return; // guarded in UI but double-check

    abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({
      ...prev,
      stage: 'submitting',
      errorMessage: null,
      abortController: controller,
    }));

    try {
      const { openSubmissionIssue, ApiError } = await import('@/lib/githubApi');

      const issueNumber = await openSubmissionIssue(
        token,
        state.selectedRepo.owner,
        state.selectedRepo.name,
        state.category,
        state.iconPath.trim() || null,
        state.pluginData,
      );

      if (controller.signal.aborted) return;

      setState((prev) => ({
        ...prev,
        stage: 'done',
        issueNumber,
      }));
    } catch (err) {
      if (controller.signal.aborted) return;
      if (err instanceof (await import('@/lib/githubApi')).ApiError) {
        setState((prev) => ({
          ...prev,
          stage: 'error',
          errorMessage: err.userMessage,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          stage: 'error',
          errorMessage: 'Network error. Please check your connection and try again.',
        }));
      }
    }
  }, [token, state.selectedRepo, state.pluginData, state.category, state.iconPath, state.releaseInfo, abort]);

  /** Reset to idle — clears everything for a new submission. */
  const reset = useCallback(() => {
    abort();
    setState(initialState);
  }, [abort]);

  return {
    state,
    search,
    selectRepo,
    deselectRepo,
    setIconPath,
    setCategory,
    submit,
    reset,
  };
}
