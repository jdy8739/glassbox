'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Header() {
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Load theme from localStorage and context after mount
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
    setThemeState(savedTheme);

    const isDark = savedTheme === 'dark' ||
      (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setResolvedTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const themeMap: Record<string, 'light' | 'dark' | 'system'> = {
      light: 'dark',
      dark: 'system',
      system: 'light',
    };
    const newTheme = themeMap[theme] || 'light';
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    // Apply theme immediately
    const isDark = newTheme === 'dark' ||
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setResolvedTheme(isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const getThemeLabel = () => {
    if (theme === 'system') {
      return `System (${resolvedTheme === 'dark' ? 'Dark' : 'Light'})`;
    }
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphic Background */}
      <div className="absolute inset-0 rounded-b-2xl mx-4 mt-2 mb-0 border header-glass" />

      {/* Content */}
      <nav className="relative mx-auto max-w-6xl px-6 flex items-center justify-between h-16">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity duration-200">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-grass-400 to-cyan-300 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold">💎</span>
          </div>
          <span className="font-bold text-base hidden sm:inline text-black dark:text-white">
            <span className="text-grass-600 dark:text-grass-400">Glass</span>
            <span className="text-black dark:text-white">box</span>
          </span>
        </Link>

        {/* Navigation Links - Center */}
        <div className="hidden lg:flex items-center gap-1">
          <Link
            href="/portfolio/new"
            className="px-4 h-10 flex items-center text-black/60 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            Analyze
          </Link>
          <Link
            href="/portfolios"
            className="px-4 h-10 flex items-center text-black/60 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            Portfolios
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2.5 ml-auto">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-button"
            title={`Current: ${getThemeLabel()}. Click to cycle through themes.`}
            aria-label={`Theme: ${getThemeLabel()}. Click to cycle through light, dark, and system themes.`}
          >
            {theme === 'light' ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                {/* Moon Icon */}
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : theme === 'dark' ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                {/* Sun Icon */}
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-2.12-2.12a4 4 0 00-5.656 0l-2.12 2.12a1 1 0 001.414 1.414l2.12-2.12a2 2 0 012.828 0l2.12 2.12a1 1 0 001.414-1.414zM2.05 6.464A1 1 0 103.464 5.05l2.12 2.12a4 4 0 015.656 0l2.12-2.12a1 1 0 11-1.414-1.414l-2.12 2.12a2 2 0 01-2.828 0L2.05 6.464zm15.657-1.414a1 1 0 00-1.414-1.414l-2.12 2.12a4 4 0 01-5.656 0l-2.12-2.12a1 1 0 10-1.414 1.414l2.12 2.12a2 2 0 012.828 0l2.12-2.12z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                {/* System Icon (Monitor) */}
                <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L13 15.414l-1.293 1.293a1 1 0 01-1.414-1.414L10.586 15H4a2 2 0 01-2-2V4zm12 9V4H4v9h10z" />
              </svg>
            )}
            {/* Tooltip */}
            <div className="theme-toggle-tooltip">
              {getThemeLabel()}
            </div>
          </button>

          {/* Primary CTA Button */}
          <Link href="/portfolio/new" className="hidden sm:block nature-button text-xs px-4 py-2 flex items-center gap-1.5">
            <span>🚀</span>
            <span>Launch</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
