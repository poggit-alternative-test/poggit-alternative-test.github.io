import type { HTMLAttributes } from 'react';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: CardPadding;
}

const paddingMap: Record<CardPadding, string> = {
  none: '0',
  sm: '12px',
  md: '16px',
  lg: '24px',
};

export function Card({ hover = false, padding = 'md', style, onMouseEnter, onMouseLeave, ...rest }: CardProps) {
  return (
    <div
      style={{
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-card)',
        padding: paddingMap[padding],
        transition: 'all 0.15s ease',
        ...style,
      }}
      onMouseEnter={e => {
        if (hover) {
          const t = e.currentTarget;
          t.style.opacity = '0.9';
          t.style.transform = 'translateY(-2px)';
        }
        onMouseEnter?.(e);
      }}
      onMouseLeave={e => {
        if (hover) {
          const t = e.currentTarget;
          t.style.opacity = '1';
          t.style.transform = 'translateY(0)';
        }
        onMouseLeave?.(e);
      }}
      {...rest}
    />
  );
}

export function CardHeader({ children, style, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div style={{ paddingBottom: '12px', borderBottom: '1px solid var(--color-border)', marginBottom: '12px', ...style }} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({ children, style, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)', ...style }} {...rest}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, style, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px', ...style }} {...rest}>
      {children}
    </p>
  );
}

export function CardContent({ children, style, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div style={{ paddingTop: '12px', ...style }} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({ children, style, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div style={{ paddingTop: '12px', borderTop: '1px solid var(--color-border)', marginTop: '12px', ...style }} {...rest}>
      {children}
    </div>
  );
}
