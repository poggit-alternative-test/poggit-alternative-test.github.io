import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Spinner } from '../Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, { bg: string; color: string; border: string; hoverBg: string; hoverColor: string }> = {
  primary: {
    bg: '#084DE6',
    color: '#FFFFFF',
    border: '#084DE6',
    hoverBg: '#0137C1',
    hoverColor: '#FFFFFF',
  },
  secondary: {
    bg: '#F4F4F5',
    color: '#09090B',
    border: '#E4E4E7',
    hoverBg: '#E4E4E7',
    hoverColor: '#09090B',
  },
  ghost: {
    bg: 'transparent',
    color: '#52525B',
    border: 'transparent',
    hoverBg: '#F4F4F5',
    hoverColor: '#09090B',
  },
  danger: {
    bg: '#EF4444',
    color: '#FFFFFF',
    border: '#EF4444',
    hoverBg: '#DC2626',
    hoverColor: '#FFFFFF',
  },
};

const sizeStyles: Record<ButtonSize, { h: string; px: string; py: string; text: string; gap: string }> = {
  sm: { h: '32px', px: '12px', py: '6px', text: '12px', gap: '6px' },
  md: { h: '38px', px: '16px', py: '8px', text: '14px', gap: '8px' },
  lg: { h: '44px', px: '20px', py: '10px', text: '16px', gap: '10px' },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    disabled,
    children,
    style,
    ...rest
  },
  ref
) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        height: s.h,
        paddingLeft: s.px,
        paddingRight: s.px,
        paddingTop: s.py,
        paddingBottom: s.py,
        fontSize: s.text,
        fontWeight: 500,
        borderRadius: '10px',
        border: `1px solid ${v.border}`,
        backgroundColor: v.bg,
        color: v.color,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
        ...style,
      }}
      onMouseEnter={e => {
        if (!disabled && !loading) {
          const t = e.currentTarget;
          t.style.backgroundColor = v.hoverBg;
          t.style.color = v.hoverColor;
        }
      }}
      onMouseLeave={e => {
        const t = e.currentTarget;
        t.style.backgroundColor = v.bg;
        t.style.color = v.color;
      }}
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});
