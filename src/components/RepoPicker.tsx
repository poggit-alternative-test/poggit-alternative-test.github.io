import { Search, Circle, ExternalLink, Star } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import type { RepoSearchResult } from '@/lib/githubApi';

interface RepoPickerProps {
  repos: RepoSearchResult[];
  isSearching: boolean;
  onSearch: (query: string) => void;
  onSelect: (repo: RepoSearchResult) => void;
  emptyMessage: string | null;
  initialQuery?: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function RepoPicker({
  repos,
  isSearching,
  onSearch,
  onSelect,
  emptyMessage,
  initialQuery = '',
}: RepoPickerProps) {
  const { colors } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Search input */}
      <div style={{ position: 'relative' }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: colors.textMuted,
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          placeholder="Search your repositories…"
          defaultValue={initialQuery}
          onChange={(e) => onSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearch((e.target as HTMLInputElement).value);
          }}
          style={{
            width: '100%',
            paddingLeft: '40px',
            paddingRight: '12px',
            paddingTop: '10px',
            paddingBottom: '10px',
            borderRadius: '10px',
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.surface,
            color: colors.textPrimary,
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = colors.brand;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = colors.border;
          }}
        />
      </div>

      {/* Repo list */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.card,
          overflow: 'hidden',
        }}
      >
        {isSearching ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              style={{
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: colors.border,
                  flexShrink: 0,
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div
                  style={{
                    height: '12px',
                    width: `${40 + (i * 17) % 40}%`,
                    borderRadius: '4px',
                    backgroundColor: colors.border,
                  }}
                />
                <div
                  style={{
                    height: '10px',
                    width: `${25 + (i * 13) % 35}%`,
                    borderRadius: '4px',
                    backgroundColor: colors.border,
                    opacity: 0.6,
                  }}
                />
              </div>
            </div>
          ))
        ) : repos.length === 0 ? (
          <div
            style={{
              padding: '32px 20px',
              textAlign: 'center',
              color: colors.textMuted,
              fontSize: '14px',
            }}
          >
            {emptyMessage ?? 'No repositories found.'}
          </div>
        ) : (
          repos.map((repo) => (
            <button
              key={repo.full_name}
              onClick={() => onSelect(repo)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px 16px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'background-color 0.12s ease',
                borderBottom: `1px solid ${colors.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.surface;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {/* Radio indicator */}
              <Circle
                size={16}
                style={{
                  color: colors.brand,
                  flexShrink: 0,
                  marginTop: '2px',
                }}
                strokeWidth={1.5}
              />

              {/* Repo info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: colors.textPrimary,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {repo.name}
                  </span>
                  {repo.stargazers_count > 0 && (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '11px',
                        color: colors.textMuted,
                        flexShrink: 0,
                      }}
                    >
                      <Star size={10} fill={colors.textMuted} />
                      {repo.stargazers_count}
                    </span>
                  )}
                </div>

                {repo.description && (
                  <p
                    style={{
                      fontSize: '12px',
                      color: colors.textMuted,
                      margin: '0 0 4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {repo.description}
                  </p>
                )}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    color: colors.textMuted,
                  }}
                >
                  <span>{repo.owner}</span>
                  <span>·</span>
                  <span>plugin.yml</span>
                  <span>·</span>
                  <span>Updated {timeAgo(repo.updated_at)}</span>
                  <a
                    href={`https://github.com/${repo.full_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      color: colors.textMuted,
                      marginLeft: '2px',
                    }}
                    aria-label="Open repo on GitHub"
                  >
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
