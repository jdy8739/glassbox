/**
 * Next.js 16 Proxy (formerly Middleware)
 *
 * This proxy handles:
 * 1. Authentication (NextAuth v5) - optimistic session checks
 * 2. i18n - language detection & redirection
 *
 * IMPORTANT: Proxy runs on Edge Runtime
 * - Keep logic lightweight (no database calls)
 * - Only check session cookies for auth
 * - Runs on EVERY request (including prefetch)
 */

import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authConfig } from './auth.config';
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

/**
 * NextAuth authentication proxy
 * Wraps the i18n proxy with auth checks
 */
const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { pathname, search } = request.nextUrl;

  // Skip proxy for:
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
  const detectedLang = detectLanguage(request as NextRequest);

  // Redirect root or non-localized paths to localized version
  const localizedPath = `/${detectedLang}${pathname}${search}`;

  const response = NextResponse.redirect(new URL(localizedPath, request.url));

  // Set cookie to remember language preference (30 days)
  response.cookies.set('NEXT_LOCALE', detectedLang, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  });

  return response;
});

// Configure which paths should run through proxy
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
