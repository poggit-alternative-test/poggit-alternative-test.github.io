import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, ChevronDown } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { PluginPreview } from '@/components/PluginPreview';
import { CiGuidance } from '@/components/CiGuidance';
import { useSubmission } from '@/hooks/useSubmission';
import { ALL_CATEGORIES, CATEGORY_LABELS } from '@/types/plugin';
import type { PluginCategory } from '@/types/plugin';

interface SubmissionFormProps {
  onBack: () => void;
}

export function SubmissionForm({ onBack }: SubmissionFormProps) {
  const { colors } = useTheme();
  const {
    state,
    setCategory,
    setIconPath,
    submit,
  } = useSubmission();

  const { selectedRepo, pluginData, releaseInfo, category, iconPath, iconPathValid } = state;

  // Debounce icon path validation
  const [iconInputValue, setIconInputValue] = useState(iconPath);
  useEffect(() => {
    setIconInputValue(iconPath);
  }, [iconPath]);

  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const handleIconChange = (value: string) => {
    setIconInputValue(value);
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => setIconPath(value), 600);
    setDebounceTimer(timer);
  };

  const canSubmit =
    pluginData != null &&
    releaseInfo != null &&
    category !== '' &&
    state.stage !== 'submitting';

  const iconValidation = iconPath.trim()
    ? iconPathValid === true
      ? 'valid'
      : iconPathValid === false
      ? 'invalid'
      : 'checking'
    : 'none';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
      }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          alignSelf: 'flex-start',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '8px',
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.surface,
          color: colors.textSecondary,
          fontSize: '13px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.card;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.surface;
        }}
      >
        ← Choose a different repo
      </button>

      {/* Plugin preview */}
      {pluginData && (
        <PluginPreview
          pluginData={pluginData}
          showBuildTier={!!releaseInfo}
        />
      )}

      {/* CI warning if no release */}
      {pluginData && !releaseInfo && (
        <CiGuidance repoUrl={selectedRepo?.full_name ?? ''} />
      )}

      {/* Form fields */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Category dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label
            htmlFor="category-select"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: colors.textPrimary,
            }}
          >
            Category <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <select
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as PluginCategory)}
              disabled={state.stage === 'submitting'}
              style={{
                width: '100%',
                paddingLeft: '14px',
                paddingRight: '36px',
                paddingTop: '10px',
                paddingBottom: '10px',
                borderRadius: '10px',
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.surface,
                color: category ? colors.textPrimary : colors.textMuted,
                fontSize: '14px',
                appearance: 'none',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="" disabled>
                Select a category…
              </option>
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors.textMuted,
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {/* Icon path */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label
            htmlFor="icon-path"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: colors.textPrimary,
            }}
          >
            Icon Path{' '}
            <span style={{ fontWeight: 400, color: colors.textMuted }}>
              (optional)
            </span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="icon-path"
              type="text"
              placeholder="resources/icon.png"
              value={iconInputValue}
              onChange={(e) => handleIconChange(e.target.value)}
              disabled={state.stage === 'submitting'}
              style={{
                width: '100%',
                paddingLeft: '14px',
                paddingRight: '40px',
                paddingTop: '10px',
                paddingBottom: '10px',
                borderRadius: '10px',
                border: `1px solid ${
                  iconValidation === 'invalid'
                    ? '#EF4444'
                    : iconValidation === 'valid'
                    ? '#22C55E'
                    : colors.border
                }`,
                backgroundColor: colors.surface,
                color: colors.textPrimary,
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(e) => {
                if (iconValidation !== 'invalid' && iconValidation !== 'valid') {
                  e.currentTarget.style.borderColor = colors.brand;
                }
              }}
              onBlur={(e) => {
                if (iconValidation !== 'invalid' && iconValidation !== 'valid') {
                  e.currentTarget.style.borderColor = colors.border;
                }
              }}
            />

            {/* Validation indicator */}
            {iconValidation !== 'none' && (
              <div
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {iconValidation === 'checking' ? (
                  <Loader2
                    size={14}
                    style={{
                      color: colors.textMuted,
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                ) : iconValidation === 'valid' ? (
                  <CheckCircle2 size={14} style={{ color: '#22C55E' }} />
                ) : (
                  <XCircle size={14} style={{ color: '#EF4444' }} />
                )}
              </div>
            )}
          </div>

          {/* Help text */}
          <p
            style={{
              fontSize: '12px',
              color: colors.textMuted,
              margin: '2px 0 0',
            }}
          >
            Leave blank to use{' '}
            <code
              style={{
                fontSize: '11px',
                padding: '1px 5px',
                borderRadius: '4px',
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`,
              }}
            >
              assets/icon.png
            </code>{' '}
            from your repo. The sync workflow falls back to the registry default
            if neither exists.
          </p>

          {/* Validation messages */}
          {iconValidation === 'invalid' && (
            <p style={{ fontSize: '12px', color: '#EF4444', margin: '2px 0 0' }}>
              File not found at this path.
            </p>
          )}
        </div>

        {/* Submit button */}
        {releaseInfo && (
          <button
            onClick={submit}
            disabled={!canSubmit}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: canSubmit ? colors.brand : colors.card,
              color: canSubmit ? '#FFFFFF' : colors.textMuted,
              fontSize: '15px',
              fontWeight: 600,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s ease',
              opacity: state.stage === 'submitting' ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              if (canSubmit) e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              if (canSubmit) e.currentTarget.style.opacity = '1';
            }}
          >
            {state.stage === 'submitting' ? (
              <>
                <Loader2
                  size={16}
                  style={{ animation: 'spin 1s linear infinite' }}
                />
                Opening issue…
              </>
            ) : (
              'Submit Plugin'
            )}
          </button>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
