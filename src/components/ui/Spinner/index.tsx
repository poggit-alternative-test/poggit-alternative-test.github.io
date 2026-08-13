export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';

const sizeMap: Record<SpinnerSize, { size: string; stroke: string }> = {
  xs: { size: '12px', stroke: '2px' },
  sm: { size: '16px', stroke: '2px' },
  md: { size: '24px', stroke: '3px' },
  lg: { size: '32px', stroke: '3px' },
};

interface SpinnerProps {
  size?: SpinnerSize;
  color?: string;
}

export function Spinner({ size = 'md', color = 'currentColor' }: SpinnerProps) {
  const { size: sz, stroke } = sizeMap[size];
  return (
    <svg
      width={sz}
      height={sz}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: 'axolotl-spin 0.8s linear infinite', flexShrink: 0 }}
    >
      <style>{`@keyframes axolotl-spin { to { transform: rotate(360deg); } }`}</style>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth={stroke}
        strokeOpacity="0.2"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    </svg>
  );
}
