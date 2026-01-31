/**
 * i18n Language Configuration
 *
 * Centralized configuration for supported languages and defaults.
 */

export const SUPPORTED_LANGUAGES = ['en', 'ko'] as const;
export const DEFAULT_LANGUAGE = 'en' as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Check if a language code is supported
 */
export function isSupportedLanguage(lang: string): lang is Language {
  return SUPPORTED_LANGUAGES.includes(lang as Language);
}

/**
 * Get a valid language, falling back to default if unsupported
 */
export function getValidLanguage(lang: string | undefined | null): Language {
  if (!lang) return DEFAULT_LANGUAGE;
  return isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;
}
