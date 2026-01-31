'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HeaderProvider } from '@/lib/header-context';
import { I18nextProvider } from 'react-i18next';
import { createI18nInstance } from '@/lib/i18n';
import { useTheme as useThemeState, type ThemePreference, type ResolvedTheme } from '@/hooks/useTheme';

interface ThemeContextType {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, lang = 'en' }: { children: ReactNode; lang?: string }) {
  const { theme, resolvedTheme, setTheme, mounted } = useThemeState();
  
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
