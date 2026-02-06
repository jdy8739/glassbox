import NextAuth, { DefaultSession } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

export const config = {
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days (matches backend JWT expiry)
  },
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
    async signIn({ user, account, profile }) {
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
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
