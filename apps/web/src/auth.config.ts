import type { NextAuthConfig } from 'next-auth';

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
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/portfolios') ||
                           nextUrl.pathname.startsWith('/profile');

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return true;
      }

      return true;
    },
  },
  providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig;
