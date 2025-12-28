'use client';

import Link from 'next/link';
import { useTheme } from '@/app/providers';
import { useEffect, useState } from 'react';

export function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
      {/* Light Mode Background */}
      <div className="hidden light:block absolute inset-0 bg-white/80 border-b border-white/20" />

      {/* Dark Mode Background */}
      <div className="dark:block hidden absolute inset-0 bg-black/40 border-b border-white/10 backdrop-blur-md" />

      {/* Content */}
      <nav className="relative mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <span className="text-2xl">🔮</span>
          <span className="font-bold text-lg hidden sm:inline">
            <span className="text-grass-500 dark:text-grass-400">Glass</span>
            <span className="text-rain-900 dark:text-white">box</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/portfolio/new" className="text-rain-700 dark:text-white/80 hover:text-grass-500 dark:hover:text-grass-400 transition font-medium">
            Analyze
          </Link>
          <Link href="/portfolios" className="text-rain-700 dark:text-white/80 hover:text-grass-500 dark:hover:text-grass-400 transition font-medium">
            Portfolios
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg transition-all duration-300
              light:bg-white/50 light:hover:bg-white/70 light:text-rain-900
              dark:bg-white/10 dark:hover:bg-white/20 dark:text-white
              border light:border-white/30 dark:border-white/10
              hover:scale-110"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                {/* Moon Icon */}
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                {/* Sun Icon */}
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-2.12-2.12a4 4 0 00-5.656 0l-2.12 2.12a1 1 0 001.414 1.414l2.12-2.12a2 2 0 012.828 0l2.12 2.12a1 1 0 001.414-1.414zM2.05 6.464A1 1 0 103.464 5.05l2.12 2.12a4 4 0 015.656 0l2.12-2.12a1 1 0 11-1.414-1.414l-2.12 2.12a2 2 0 01-2.828 0L2.05 6.464zm15.657-1.414a1 1 0 00-1.414-1.414l-2.12 2.12a4 4 0 01-5.656 0l-2.12-2.12a1 1 0 10-1.414 1.414l2.12 2.12a2 2 0 012.828 0l2.12-2.12z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Primary CTA Button */}
          <Link href="/portfolio/new" className="hidden sm:block nature-button text-sm px-6 py-2">
            Start Analyzing
          </Link>
        </div>
      </nav>
    </header>
  );
}
