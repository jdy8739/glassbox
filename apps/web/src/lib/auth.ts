import NextAuth, { DefaultSession, type NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '@/auth.config';
import type { User, Account, Profile, Session } from 'next-auth';
import type { AdapterUser } from 'next-auth/adapters';
import type { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

export const config = {
  ...authConfig,  // basePath already in authConfig
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        id: { label: 'ID', type: 'text' },
        email: { label: 'Email', type: 'text' },
        name: { label: 'Name', type: 'text' },
      },
      async authorize(credentials) {
        try {
          // This provider is used to sync NextAuth session with backend session
          // User data is passed directly from the login response
          if (!credentials?.id || !credentials?.email) {
            return null;
          }

          return {
            id: credentials.id as string,
            email: credentials.email as string,
            name: credentials.name as string || '',
          };
        } catch (e) {
          // Silently fail - error already logged by backend
          return null;
        }
      },
    }),
  ],
  // Require NEXTAUTH_SECRET in all environments
  secret: (() => {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      throw new Error(
        'NEXTAUTH_SECRET environment variable must be set. ' +
        'Generate a secure secret with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
      );
    }
    return secret;
  })(),
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async signIn(params) {
      const { user, account } = params;

      // Skip sync for credentials provider (user already verified against backend)
      if (account?.provider === 'credentials') {
        return true;
      }

      // Sync user with backend (OAuth flow)
      console.log('[Auth] Starting OAuth signin for:', user.email);

      try {
        if (!process.env.NEXT_PUBLIC_API_URL) {
          console.error('[Auth] NEXT_PUBLIC_API_URL not set:', {
            isDev: process.env.NODE_ENV === 'development',
          });
          return false; // Will redirect to login page
        }

        const syncUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/sync`;
        console.log('[Auth] Syncing with backend:', { syncUrl, email: user.email });

        const response = await fetch(syncUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Send cookies
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            googleId: account?.providerAccountId,
          }),
        });

        console.log('[Auth] Backend response:', {
          status: response.status,
          ok: response.ok,
        });

        if (!response.ok) {
          let errorMessage = 'Unknown error';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
          } catch (e) {
            const text = await response.text();
            errorMessage = text.substring(0, 200);
          }

          console.error('[Auth] Backend sync failed:', {
            status: response.status,
            error: errorMessage,
            email: user.email,
          });
          return false; // Will redirect to login page
        }

        console.log('[Auth] ✅ OAuth user synced successfully:', user.email);
        return true;
      } catch (error) {
        console.error('[Auth] ❌ OAuth sync error:', {
          message: error instanceof Error ? error.message : String(error),
          type: error instanceof Error ? error.constructor.name : typeof error,
        });
        return false; // Will redirect to login page
      }
    },
    async jwt(params) {
      const { token, user } = params;

      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session(params) {
      const { session, token } = params;

      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect(params) {
      const { url, baseUrl } = params;

      // Allow relative URLs (already have language prefix)
      if (url.startsWith('/')) {
        return url;
      }

      // Allow URLs from same domain
      if (new URL(url).origin === new URL(baseUrl).origin) {
        return url;
      }

      // For auth flow redirects, use language from request headers (Accept-Language)
      // Or default to 'en' if no preference detected
      // The proxy.ts middleware will handle language detection on the next request
      return `${baseUrl}/portfolios`;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
