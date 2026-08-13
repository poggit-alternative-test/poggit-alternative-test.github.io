import type { PluginCategory } from '../types/plugin';
import { ALL_CATEGORIES, CATEGORY_LABELS } from '../types/plugin';

interface CategoryFilterProps {
  selected: PluginCategory | 'all';
  onChange: (value: PluginCategory | 'all') => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <button
        onClick={() => onChange('all')}
        style={{
          display: 'block',
          width: '100%',
          textAlign: 'left',
          padding: '6px 10px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: selected === 'all' ? 600 : 400,
          color: selected === 'all' ? 'var(--color-brand)' : 'var(--color-text-secondary)',
          backgroundColor: selected === 'all' ? 'var(--color-brand-bg)' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.1s ease',
        }}
      >
        All categories
      </button>
      {ALL_CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: selected === cat ? 600 : 400,
            color: selected === cat ? 'var(--color-brand)' : 'var(--color-text-secondary)',
            backgroundColor: selected === cat ? 'var(--color-brand-bg)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.1s ease',
          }}
        >
          {CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  );
}
