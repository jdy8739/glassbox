/**
 * i18n Path Utilities
 *
 * Helper functions for building and manipulating localized paths.
 */

import { type Language, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './config';

/**
 * Add language prefix to a path
 *
 * @example
 * getLocalizedPath('/portfolio/new', 'en') => '/en/portfolio/new'
 * getLocalizedPath('/', 'ko') => '/ko'
 */
export function getLocalizedPath(path: string, lang: Language): string {
  // Remove leading slash for consistency
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Build localized path
  return `/${lang}${cleanPath ? `/${cleanPath}` : ''}`;
}

/**
 * Remove language prefix from a path
 *
 * @example
 * stripLangFromPath('/en/portfolio/new') => '/portfolio/new'
 * stripLangFromPath('/ko') => '/'
 */
export function stripLangFromPath(path: string): string {
  const segments = path.split('/').filter(Boolean);

  // If first segment is a language, remove it
  if (segments.length > 0 && SUPPORTED_LANGUAGES.includes(segments[0] as Language)) {
    segments.shift();
  }

  return `/${segments.join('/')}`;
}

/**
 * Extract language from path
 *
 * @example
 * extractLangFromPath('/en/portfolio/new') => 'en'
 * extractLangFromPath('/ko') => 'ko'
 * extractLangFromPath('/portfolio/new') => null
 */
export function extractLangFromPath(path: string): Language | null {
  const segments = path.split('/').filter(Boolean);

  if (segments.length > 0 && SUPPORTED_LANGUAGES.includes(segments[0] as Language)) {
    return segments[0] as Language;
  }

  return null;
}

/**
 * Build a complete path with language prefix and optional search params
 *
 * @example
 * buildPath('/portfolio/new', 'en') => '/en/portfolio/new'
 * buildPath('/analysis/result', 'ko', { portfolioId: '123' }) => '/ko/analysis/result?portfolioId=123'
 */
export function buildPath(
  basePath: string,
  lang: Language,
  searchParams?: Record<string, string | number | boolean>
): string {
  const localizedPath = getLocalizedPath(basePath, lang);

  if (!searchParams || Object.keys(searchParams).length === 0) {
    return localizedPath;
  }

  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    params.append(key, String(value));
  });

  return `${localizedPath}?${params.toString()}`;
}
