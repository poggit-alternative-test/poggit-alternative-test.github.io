import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, RefreshCw, ExternalLink } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSubmission } from '@/hooks/useSubmission';
import { RepoPicker } from '@/components/RepoPicker';
import { SubmissionForm } from '@/components/SubmissionForm';

export function SubmitPage() {
  const { colors } = useTheme();
  const { state, search, selectRepo, deselectRepo, reset } = useSubmission();
  const navigate = useNavigate();

  const {
    stage,
    repos,
    searchQuery,
    selectedRepo,
    pluginData,
    releaseInfo,
    issueNumber,
    errorMessage,
  } = state;

  // Auto-search on mount with empty query (shows all repos)
  useEffect(() => {
    if (stage === 'idle' && repos.length === 0) {
      search('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSearching = stage === 'searching';
  const isValidating = stage === 'validating';
  const hasSelectedRepo = selectedRepo !== null && (stage === 'validating' || stage === 'selected' || stage === 'ready' || stage === 'submitting');

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Page heading */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: colors.textPrimary,
            margin: '0 0 8px',
          }}
        >
          Submit a Plugin
        </h1>
        <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
          Search for your repository, verify the plugin details, and submit.
        </p>
      </div>

      {/* Global error banner */}
      {(stage === 'error' || errorMessage) && (
        <div
          style={{
            marginBottom: '24px',
            padding: '14px 16px',
            borderRadius: '10px',
            border: `1px solid #EF4444`,
            backgroundColor: '#FEF2F2',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '16px', flexShrink: 0 }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#991B1B',
                margin: '0 0 4px',
              }}
            >
              {stage === 'error' ? 'Something went wrong' : 'Error'}
            </p>
            <p style={{ fontSize: '13px', color: '#7F1D1D', margin: 0 }}>
              {errorMessage}
            </p>
            {stage === 'error' && (
              <button
                onClick={reset}
                style={{
                  marginTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: `1px solid #FCA5A5`,
                  backgroundColor: '#FEE2E2',
                  color: '#991B1B',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={12} />
                Try again
              </button>
            )}
          </div>
        </div>
      )}

      {/* Success state */}
      {stage === 'done' && (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle2 size={32} style={{ color: '#22C55E' }} />
          </div>

          <div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: colors.textPrimary,
                margin: '0 0 8px',
              }}
            >
              Submission received!
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: colors.textSecondary,
                margin: 0,
                maxWidth: '400px',
                lineHeight: 1.6,
              }}
            >
              Your submission for{' '}
              <strong>{pluginData?.name}</strong> has been opened as{' '}
              <a
                href={`https://github.com/poggit-alternative-test/plugin-registry/issues/${issueNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: colors.brand }}
              >
                Issue #{issueNumber}
                <ExternalLink size={11} style={{ marginLeft: '3px' }} />
              </a>
              .
              A maintainer will review it shortly.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a
              href={`https://github.com/poggit-alternative-test/plugin-registry/issues/${issueNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                backgroundColor: colors.brand,
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              View on GitHub <ExternalLink size={14} />
            </a>
            <button
              onClick={reset}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.surface,
                color: colors.textPrimary,
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} />
              Submit another plugin
            </button>
          </div>
        </div>
      )}

      {/* Repo picker — shown when no repo selected (or still searching) */}
      {stage !== 'done' && !hasSelectedRepo && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <RepoPicker
            repos={repos}
            isSearching={isSearching}
            onSearch={search}
            onSelect={selectRepo}
            emptyMessage={errorMessage ?? undefined}
            initialQuery={searchQuery}
          />

          {/* Tips */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              backgroundColor: colors.card,
              border: `1px solid ${colors.border}`,
            }}
          >
            <p
              style={{
                fontSize: '12px',
                color: colors.textMuted,
                margin: '0 0 8px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Tips
            </p>
            <ul
              style={{
                fontSize: '13px',
                color: colors.textSecondary,
                margin: 0,
                paddingLeft: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <li>
                Only <strong>public</strong> repositories with a <code>plugin.yml</code> file in the root appear here.
              </li>
              <li>
                Your repository must have a <strong>GitHub Release</strong> with a <code>.phar</code> file to submit.
              </li>
              <li>
                Archived repositories are not shown.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Validating spinner */}
      {isValidating && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            borderRadius: '10px',
            backgroundColor: colors.card,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: `2px solid ${colors.border}`,
              borderTopColor: colors.brand,
              animation: 'spin 0.8s linear infinite',
              flexShrink: 0,
            }}
          />
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: colors.textPrimary, margin: '0 0 2px' }}>
              Validating {selectedRepo?.name}…
            </p>
            <p style={{ fontSize: '12px', color: colors.textMuted, margin: 0 }}>
              Checking plugin.yml and release information
            </p>
          </div>
        </div>
      )}

      {/* Submission form — shown after repo is selected and validated */}
      {hasSelectedRepo && !isValidating && stage !== 'done' && (
        <SubmissionForm onBack={deselectRepo} />
      )}

      {/* Need to be logged in to see the rest */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
