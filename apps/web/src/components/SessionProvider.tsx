'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import type { Session } from 'next-auth';
import { useOAuthSync } from '@/hooks/useOAuthSync';

function OAuthSyncWrapper({ children }: { children: ReactNode }) {
  // Syncs OAuth users with backend to get accessToken cookie
  useOAuthSync();
  return <>{children}</>;
}

export function SessionProvider({ children, session }: { children: ReactNode; session?: Session | null }) {
  return (
    <NextAuthSessionProvider basePath="/auth" session={session}>
      <OAuthSyncWrapper>
        {children}
      </OAuthSyncWrapper>
    </NextAuthSessionProvider>
  );
}
