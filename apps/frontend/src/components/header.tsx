'use client';

import Link from 'next/link';
import { useTheme } from '@/app/providers';
import { useEffect, useState } from 'react';

export function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const themeMap: Record<string, 'light' | 'dark' | 'system'> = {
      light: 'dark',
      dark: 'system',
      system: 'light',
    };
    setTheme(themeMap[theme] || 'light');
  };

  const getThemeLabel = () => {
    if (theme === 'system') {
      return `System (${resolvedTheme === 'dark' ? 'Dark' : 'Light'})`;
    }
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphic Background - Consistent with nature-panel */}
      <div
        className="absolute inset-0 rounded-b-2xl mx-4 mt-2 mb-0 border"
        style={{
          background: 'rgba(255, 255, 255, 0.12)',
          borderColor: 'rgba(255, 255, 255, 0.18)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      />

      {/* Dark mode adjustment */}
      <div className="absolute inset-0 rounded-b-2xl mx-4 mt-2 mb-0 dark:block hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderColor: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      />

      {/* Content */}
      <nav className="relative mx-auto max-w-6xl px-6 py-3.5 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity duration-200">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-grass-400 to-cyan-300 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold">💎</span>
          </div>
          <span className="font-bold text-base hidden sm:inline text-white">
            <span className="text-grass-500 dark:text-grass-400">Glass</span>
            <span className="dark:text-white">box</span>
          </span>
        </Link>

        {/* Navigation Links - Center */}
        <div className="hidden lg:flex items-center gap-1">
          <Link
            href="/portfolio/new"
            className="px-4 py-2 text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            Analyze
          </Link>
          <Link
            href="/portfolios"
            className="px-4 py-2 text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            Portfolios
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2.5 ml-auto">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all duration-300 text-white/70 hover:text-white group relative"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
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
            <div className="absolute top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
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
