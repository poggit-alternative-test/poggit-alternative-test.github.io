import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  bg: string;
  surface: string;
  border: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  brand: string;
  brandBg: string;
}

const lightColors: ThemeColors = {
  bg: '#FAFAFA',
  surface: '#FFFFFF',
  border: '#E4E4E7',
  card: '#F4F4F5',
  textPrimary: '#09090B',
  textSecondary: '#52525B',
  textMuted: '#A1A1AA',
  brand: '#084DE6',
  brandBg: '#EBF5FF',
};

const darkColors: ThemeColors = {
  bg: '#09090B',
  surface: '#111113',
  border: '#27272A',
  card: '#18181B',
  textPrimary: '#FAFAFA',
  textSecondary: '#A1A1AA',
  textMuted: '#52525B',
  brand: '#084DE6',
  brandBg: '#010B2E',
};

type PrefersDark = boolean;

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  resolvedMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'axolotl-theme';

function getSystemPrefersDark(): PrefersDark {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function computeColors(mode: ThemeMode, systemDark: PrefersDark): ThemeColors {
  if (mode === 'system') {
    return systemDark ? darkColors : lightColors;
  }
  return mode === 'dark' ? darkColors : lightColors;
}

function computeResolvedMode(mode: ThemeMode, systemDark: PrefersDark): 'light' | 'dark' {
  if (mode === 'system') return systemDark ? 'dark' : 'light';
  return mode;
}

export function ThemeProvider({ children }: { children: JSX.Element }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
    } catch {}
    return 'system';
  });

  const [systemDark, setSystemDark] = useState<PrefersDark>(getSystemPrefersDark);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    const resolved = computeResolvedMode(mode, systemDark);
    root.classList.add(resolved);
  }, [mode, systemDark]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  const toggleMode = useCallback(() => {
    const resolved = computeResolvedMode(mode, systemDark);
    setMode(resolved === 'dark' ? 'light' : 'dark');
  }, [mode, systemDark, setMode]);

  const colors = computeColors(mode, systemDark);
  const resolvedMode = computeResolvedMode(mode, systemDark);

  return (
    <ThemeContext.Provider value={{ mode, colors, resolvedMode, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
