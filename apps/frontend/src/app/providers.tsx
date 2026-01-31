'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HeaderProvider } from '@/lib/header-context';
import { I18nextProvider } from 'react-i18next';
import { createI18nInstance } from '@/lib/i18n';

type ThemePreference = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Utility: Resolve 'system' preference to actual theme
const resolveTheme = (preferredTheme: ThemePreference): ResolvedTheme => {
  if (preferredTheme === 'system') {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return preferredTheme;
};

// Utility: Apply theme class to DOM
const applyTheme = (resolved: ResolvedTheme) => {
  const html = document.documentElement;
  if (resolved === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
};

// Utility: Load theme preference from localStorage
const loadSavedTheme = (): ThemePreference => {
  const saved = localStorage.getItem('theme') as ThemePreference | null;
  return saved || 'system';
};

// Utility: Setup media query listener with browser compatibility
const setupMediaQueryListener = (
  isSystemTheme: boolean,
  onThemeChange: (theme: ResolvedTheme) => void
): (() => void) | undefined => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = (e: MediaQueryListEvent) => {
    if (isSystemTheme) {
      const newTheme = e.matches ? 'dark' : 'light';
      onThemeChange(newTheme);
    }
  };

  // Modern browsers API
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }

  // Fallback for older browsers
  if (mediaQuery.addListener) {
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }

  return undefined;
};

export function ThemeProvider({ children, lang = 'en' }: { children: ReactNode; lang?: string }) {
  const [theme, setThemeState] = useState<ThemePreference>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [mounted, setMounted] = useState(false);
  
  // Create i18n instance once with the server-provided language
  const [i18n] = useState(() => createI18nInstance(lang));
  
  // Ensure QueryClient is created once per component lifecycle
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection)
        retry: 1, // Retry failed requests once
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
      },
      mutations: {
        retry: 1, // Retry failed mutations once
      },
    },
  }));

  // Initialize theme on mount
  useEffect(() => {
    // Load saved preference
    const initialTheme = loadSavedTheme();
    const resolved = resolveTheme(initialTheme);

    // Apply to state and DOM
    setThemeState(initialTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);

    // Setup listener for system theme changes
    const cleanup = setupMediaQueryListener(
      initialTheme === 'system',
      (newTheme) => {
        setResolvedTheme(newTheme);
        applyTheme(newTheme);
      }
    );

    // Mark as mounted (prevents hydration mismatch)
    setMounted(true);

    return cleanup;
  }, [lang, i18n]);

  // Update theme
  const setTheme = (newTheme: ThemePreference) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    const resolved = resolveTheme(newTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  };

  return (
    <I18nextProvider i18n={i18n}>
    <QueryClientProvider client={queryClient}>
      {mounted ? (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
          <HeaderProvider>
            {children}
          </HeaderProvider>
        </ThemeContext.Provider>
      ) : (
        <>{children}</>
      )}
    </QueryClientProvider>
    </I18nextProvider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
