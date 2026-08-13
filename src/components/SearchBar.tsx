import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search plugins...' }: SearchBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderRadius: '10px',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        padding: '0 12px',
      }}
    >
      <Search size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          color: 'var(--color-text-primary)',
          fontSize: '14px',
          padding: '10px 0',
        }}
      />
    </div>
  );
}
