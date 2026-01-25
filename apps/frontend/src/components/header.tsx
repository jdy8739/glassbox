'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor, Zap } from 'lucide-react';
import { GlassboxIcon } from './glassbox-icon';

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
      <div className="absolute inset-0 rounded-b-2xl mx-4 mb-0 border header-glass" />

      {/* Content */}
      <nav className="relative mx-auto max-w-6xl px-6 flex items-center justify-between h-16">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity duration-200">
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
            <GlassboxIcon />
          </div>
          <span className="font-bold text-base hidden sm:inline text-black dark:text-white">
            <span className="text-cyan-600 dark:text-cyan-400">Glass</span>
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
              <Moon className="w-4 h-4" />
            ) : theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Monitor className="w-4 h-4" />
            )}
            {/* Tooltip */}
            <div className="theme-toggle-tooltip">
              {getThemeLabel()}
            </div>
          </button>

          {/* Primary CTA Button */}
          <Link href="/portfolio/new" className="hidden sm:block glass-button text-xs px-4 py-2 flex items-center gap-1.5">
            <Zap className="w-4 h-4" />
            <span>Launch</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
