import { useEffect, useState } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const getResolvedTheme = (preferredTheme: ThemePreference): ResolvedTheme => {
  if (preferredTheme !== 'system') return preferredTheme;
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyResolvedTheme = (resolved: ResolvedTheme) => {
  document.documentElement.classList.toggle('dark', resolved === 'dark');
};

export function useTheme() {
  const [theme, setThemeState] = useState<ThemePreference>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initialTheme = (localStorage.getItem('theme') as ThemePreference | null) || 'system';
    const resolved = getResolvedTheme(initialTheme);
    setThemeState(initialTheme);
    setResolvedTheme(resolved);
    applyResolvedTheme(resolved);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (initialTheme === 'system') {
        const nextTheme = e.matches ? 'dark' : 'light';
        setResolvedTheme(nextTheme);
        applyResolvedTheme(nextTheme);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    }

    setMounted(true);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Update theme
  const setTheme = (newTheme: ThemePreference) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    const resolved = getResolvedTheme(newTheme);
    setResolvedTheme(resolved);
    applyResolvedTheme(resolved);
  };

  return { theme, resolvedTheme, setTheme, mounted };
}
