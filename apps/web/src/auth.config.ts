import type { NextAuthConfig } from 'next-auth';
import { DEFAULT_LANGUAGE } from '@/lib/i18n/config';

/**
 * Edge-compatible auth configuration
 * Used in proxy.ts for optimistic authentication checks
 *
 * IMPORTANT: Do NOT import database adapters or heavy dependencies here
 * This config must be compatible with Edge Runtime
 */
export const authConfig = {
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: `/${DEFAULT_LANGUAGE}/login`,
    error: '/auth/error',  // Custom error handler that redirects to language-specific page
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/portfolios') ||
                           nextUrl.pathname.startsWith('/profile');

      if (isOnDashboard) {
        // Allow access if logged in, otherwise will redirect to signIn page
        return isLoggedIn;
      }

      return true;
    },
  },
  providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig;
