'use client';

/**
 * useLocalizedRouter Hook
 *
 * Drop-in replacement for Next.js useRouter that automatically prefixes
 * paths in push() and replace() with the current language.
 *
 * @example
 * const router = useLocalizedRouter();
 * router.push('/analysis/result'); // Auto-prefixes with /en/ or /ko/
 * console.log(router.currentLang); // 'en' or 'ko'
 */

import { useRouter as useNextRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { type Language, DEFAULT_LANGUAGE } from '@/lib/i18n/config';
import { getLocalizedPath } from '@/lib/i18n/paths';

export function useLocalizedRouter() {
  const router = useNextRouter();
  const params = useParams();
  const currentLang = (params?.lang as Language) || DEFAULT_LANGUAGE;

  return {
    ...router,
    currentLang,
    push: (href: string, options?: any) => {
      const localizedHref = getLocalizedPath(href, currentLang);
      return router.push(localizedHref, options);
    },
    replace: (href: string, options?: any) => {
      const localizedHref = getLocalizedPath(href, currentLang);
      return router.replace(localizedHref, options);
    },
  };
}
