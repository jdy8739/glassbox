'use client';

import { LocalizedLink } from '@/components/LocalizedLink';
import { Moon, Sun, Monitor, Zap, Languages, LogOut, User } from 'lucide-react';
import { GlassboxIcon } from './glassbox-icon';
import { useHeader } from '@/lib/header-context';
import { useTranslation } from 'react-i18next';
import { useLocalizedRouter } from '@/hooks/useLocalizedRouter';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import { useSession, signOut } from 'next-auth/react';

export function Header() {
  const { navContent, actionContent } = useHeader();
  const { t, i18n } = useTranslation();
  const router = useLocalizedRouter();
  const pathname = usePathname();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { status } = useSession();
  
  const isLoading = status === 'loading';
  const isLoggedIn = status === 'authenticated';

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const toggleTheme = () => {
    const themeMap: Record<string, 'light' | 'dark' | 'system'> = {
      light: 'dark',
      dark: 'system',
      system: 'light',
    };
    const newTheme = themeMap[theme] || 'light';
    setTheme(newTheme);
  };

  const getThemeLabel = () => {
    if (theme === 'system') {
      const resolved = resolvedTheme === 'dark' ? t('theme.dark') : t('theme.light');
      return `${t('theme.system')} (${resolved})`;
    }
    return theme === 'dark' ? t('theme.dark') : t('theme.light');
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ko' : 'en';

    // Navigate to the same page but in the new language
    // Get current path without language prefix
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(en|ko)/, '') || '/';
    const newPath = `/${nextLang}${pathWithoutLang}${window.location.search}`;

    // Middleware will set NEXT_LOCALE cookie on navigation
    // i18n will be initialized with new language on page load
    window.location.href = newPath;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphic Background */}
      <div className="absolute inset-0 rounded-b-2xl mx-4 mb-0 border header-glass" />

      {/* Content */}
      <nav className="relative mx-auto max-w-6xl px-6 flex items-center justify-between h-16">
        {/* Left Side: Logo, Back Nav, and Main Links */}
        <div className="flex items-center gap-6">
          <LocalizedLink href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity duration-200">
            <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
              <GlassboxIcon />
            </div>
            <span className="font-bold text-base hidden sm:inline text-black dark:text-white">
              <span className="text-cyan-600 dark:text-cyan-400">Glass</span>
              <span className="text-black dark:text-white">box</span>
            </span>
          </LocalizedLink>
          
          {/* Dynamic Back/Nav controls injected from pages */}
          {navContent && (
            <div className="pl-3 md:pl-6 border-l border-black/10 dark:border-white/10 ml-3 md:ml-6 flex items-center">
              {navContent}
            </div>
          )}

          {/* Navigation Links (Always Visible) */}
          <div className={`hidden lg:flex items-center gap-1 ${!navContent ? 'pl-6 border-l border-black/10 dark:border-white/10' : ''}`}>
            <LocalizedLink
              href="/portfolio/new"
              className="px-4 h-9 flex items-center text-black/60 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors duration-200 text-sm font-medium rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
            >
              {t('nav.analyze')}
            </LocalizedLink>
            <LocalizedLink
              href="/portfolios"
              className="px-4 h-9 flex items-center text-black/60 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors duration-200 text-sm font-medium rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
            >
              {t('nav.portfolios')}
            </LocalizedLink>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="h-9 px-3 flex items-center gap-2 rounded-lg text-xs font-medium text-slate-700 dark:text-white/80 bg-white/10 dark:bg-slate-800/50 border border-black/5 dark:border-white/10 hover:text-slate-900 dark:hover:text-white transition-all"
            title={t(i18n.language === 'en' ? 'language.switch-to-korean' : 'language.switch-to-english')}
            aria-label={t(i18n.language === 'en' ? 'language.switch-to-korean' : 'language.switch-to-english')}
          >
            <Languages className="w-4 h-4" />
            <span className="hidden sm:inline">{t('common.language')}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-700 dark:text-white/80 bg-white/10 dark:bg-slate-800/50 border border-black/5 dark:border-white/10 hover:text-slate-900 dark:hover:text-white transition-all relative"
            title={t('theme.current-label', { theme: getThemeLabel() })}
            aria-label={t('theme.current-label', { theme: getThemeLabel() })}
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

          {actionContent}

          {isLoading ? (
             <div className="w-20 h-9 bg-black/5 dark:bg-white/10 rounded-lg animate-pulse" />
          ) : isLoggedIn ? (
            /* Logged In State */
            <div className="flex items-center gap-2">
              <LocalizedLink href="/profile" className="w-9 h-9 flex items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 text-slate-700 dark:text-white/80 hover:bg-black/10 dark:hover:bg-white/20 transition-all">
                <User className="w-4 h-4" />
              </LocalizedLink>
              <button
                onClick={handleLogout}
                className="h-9 px-3 flex items-center gap-2 rounded-lg text-xs font-medium text-slate-700 dark:text-white/80 bg-white/10 dark:bg-slate-800/50 border border-black/5 dark:border-white/10 hover:text-coral-600 dark:hover:text-coral-400 hover:bg-coral-50 dark:hover:bg-coral-900/20 transition-all"
                title={t('auth.logout')}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t('auth.logout')}</span>
              </button>
            </div>
          ) : (
            /* Auth Buttons */
            <div className="flex items-center gap-2">
              {!pathname?.includes('/login') && (
                <LocalizedLink 
                  href="/login" 
                  className="hidden sm:flex h-9 px-4 items-center gap-2 rounded-lg text-xs font-medium text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all"
                >
                  <span>{t('nav.signin')}</span>
                </LocalizedLink>
              )}
              {!pathname?.includes('/signup') && (
                <LocalizedLink 
                  href="/signup" 
                  className="hidden sm:flex h-9 px-4 items-center gap-2 rounded-lg text-xs font-medium text-white bg-black dark:bg-white dark:text-black hover:opacity-90 transition-all shadow-sm"
                >
                  <span>{t('nav.signup')}</span>
                </LocalizedLink>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}