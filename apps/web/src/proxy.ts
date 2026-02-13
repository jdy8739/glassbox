/**
 * Next.js Proxy for i18n Language Detection & Redirection
 *
 * This proxy:
 * 1. Detects user's preferred language from Accept-Language header
 * 2. Redirects root path (/) to localized version (/en/ or /ko/)
 * 3. Sets NEXT_LOCALE cookie to remember preference
 * 4. Preserves query parameters during redirect
 * 5. Skips API routes, static files, and Next.js internal paths
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, type Language } from '@/lib/i18n/config';
import { detectLanguage as parseAcceptLanguage } from '@/lib/detect-language';

/**
 * Detect preferred language from cookie or Accept-Language header
 */
function detectLanguage(request: NextRequest): Language {
  // Priority 1: Check if we have a saved preference in cookies
  const cookieLang = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLang && SUPPORTED_LANGUAGES.includes(cookieLang as Language)) {
    return cookieLang as Language;
  }

  // Priority 2: Parse Accept-Language header with quality values
  const acceptLanguage = request.headers.get('accept-language') || '';
  const detectedLang = parseAcceptLanguage(
    acceptLanguage,
    [...SUPPORTED_LANGUAGES],
    DEFAULT_LANGUAGE
  );

  return detectedLang as Language;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Skip middleware for:
  // - API routes
  // - Static files (_next/static, _next/image)
  // - Public files (favicon, etc.)
  // - Already localized paths (starts with /en/ or /ko/)
  const shouldSkip =
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') || // Files with extensions
    SUPPORTED_LANGUAGES.some((lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`);

  if (shouldSkip) {
    return NextResponse.next();
  }

  // Detect preferred language
  const detectedLang = detectLanguage(request);

  // Redirect root or non-localized paths to localized version
  const localizedPath = `/${detectedLang}${pathname}${search}`;

  const response = NextResponse.redirect(new URL(localizedPath, request.url));

  // Set cookie to remember preference (30 days)
  response.cookies.set('NEXT_LOCALE', detectedLang, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  });

  return response;
}

// Configure which paths should run through middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon.svg (favicon files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|favicon.svg).*)',
  ],
};
