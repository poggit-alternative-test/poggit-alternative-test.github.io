import { CheckCircle2, Cpu, AlertTriangle } from 'lucide-react';
import type { BuildTier } from '../types/plugin';

/**
 * Renders the build-tier badge for a plugin.
 * Returns null when build_tier is null (unknown / unavailable).
 */
export function Badge({ tier }: { tier: BuildTier }) {
  if (tier === null) return null;

  switch (tier) {
    case 'verified':
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            borderRadius: '9999px',
            paddingLeft: '8px',
            paddingRight: '8px',
            paddingTop: '2px',
            paddingBottom: '2px',
            fontSize: '11px',
            fontWeight: 500,
            backgroundColor: '#D1FAE5',
            color: '#065F46',
            border: '1px solid #6EE7B7',
          }}
        >
          <CheckCircle2 size={12} />
          Verified build
        </span>
      );
    case 'built-via-ci':
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            borderRadius: '9999px',
            paddingLeft: '8px',
            paddingRight: '8px',
            paddingTop: '2px',
            paddingBottom: '2px',
            fontSize: '11px',
            fontWeight: 500,
            backgroundColor: '#DBEAFE',
            color: '#1E40AF',
            border: '1px solid #93C5FD',
          }}
        >
          <Cpu size={12} />
          Built via CI
        </span>
      );
    case 'unverified':
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            borderRadius: '9999px',
            paddingLeft: '8px',
            paddingRight: '8px',
            paddingTop: '2px',
            paddingBottom: '2px',
            fontSize: '11px',
            fontWeight: 500,
            backgroundColor: '#FEF3C7',
            color: '#92400E',
            border: '1px solid #FCD34D',
          }}
        >
          <AlertTriangle size={12} />
          Unverified
        </span>
      );
    default:
      return null;
  }
}
