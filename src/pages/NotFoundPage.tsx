import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui';

export function NotFoundPage() {
  const { colors } = useTheme();

  return (
    <div
      className="page-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        paddingTop: '64px',
        paddingBottom: '64px',
      }}
    >
      <span style={{ fontSize: '64px', fontWeight: 800, color: colors.border, lineHeight: 1, marginBottom: '16px' }}>
        404
      </span>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: colors.textPrimary, marginBottom: '8px' }}>
        Page not found
      </h1>
      <p style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '24px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button leftIcon={<Home size={14} />}>Back to Home</Button>
      </Link>
    </div>
  );
}
