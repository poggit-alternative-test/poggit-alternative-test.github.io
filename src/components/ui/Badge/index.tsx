import type { BuildTier } from '@/types/plugin';
import type { HTMLAttributes } from 'react';
import { CheckCircle2, Cpu, AlertTriangle } from 'lucide-react';

export type BadgeVariant = 'verified' | 'built' | 'unverified' | 'info' | 'warning';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  verified: {
    bg: '#D1FAE5',
    color: '#065F46',
    border: '#6EE7B7',
  },
  built: {
    bg: '#DBEAFE',
    color: '#1E40AF',
    border: '#93C5FD',
  },
  unverified: {
    bg: '#FEF3C7',
    color: '#92400E',
    border: '#FCD34D',
  },
  info: {
    bg: 'var(--color-brand-bg)',
    color: 'var(--color-brand)',
    border: 'var(--color-brand)',
  },
  warning: {
    bg: '#FEF3C7',
    color: '#92400E',
    border: '#FCD34D',
  },
};

export function Badge({ variant = 'info', children, style, ...rest }: BadgeProps) {
  const v = variantStyles[variant];
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
        backgroundColor: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}

// Convenience: map BuildTier to Badge
export function StatusBadge({ status }: { status: BuildTier | null }) {
  if (status === null) return null;
  switch (status) {
    case 'verified':
      return (
        <Badge variant="verified">
          <CheckCircle2 size={12} />
          Verified build
        </Badge>
      );
    case 'built-via-ci':
      return (
        <Badge variant="built">
          <Cpu size={12} />
          Built via CI
        </Badge>
      );
    case 'unverified':
      return (
        <Badge variant="unverified">
          <AlertTriangle size={12} />
          Unverified
        </Badge>
      );
    default:
      return null;
  }
}
