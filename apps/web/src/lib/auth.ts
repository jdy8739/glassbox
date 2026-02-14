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
  ...authConfig,
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

      // Sync user with backend
      try {
        if (!process.env.NEXT_PUBLIC_API_URL) {
          // NEXT_PUBLIC_API_URL is required for backend sync
          return false;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Send cookies
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            googleId: account?.providerAccountId,
          }),
        });

        if (!response.ok) {
          // Backend will log the detailed error
          return false;
        }

        return true;
      } catch (error) {
        // Backend will log the detailed error
        return false;
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
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
