import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

/**
 * Syncs OAuth users with backend to get accessToken cookie
 *
 * Problem: NextAuth signIn callback runs server-side, so backend
 * cookies don't get stored in browser. This hook fixes that by
 * making a client-side sync call after OAuth login.
 */
export function useOAuthSync() {
  const { data: session, status } = useSession();
  const syncedRef = useRef(false);

  useEffect(() => {
    // Only run once per component lifecycle
    if (syncedRef.current) return;

    // Wait for session to load
    if (status !== 'authenticated' || !session?.user?.email) return;

    // Make client-side call to get backend cookie
    // We ALWAYS call this because we can't check if httpOnly cookie exists
    const syncWithBackend = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!backendUrl) {
          console.error('[OAuth Sync] NEXT_PUBLIC_API_URL not set');
          return;
        }

        console.log('[OAuth Sync] Syncing backend cookie for:', session.user.email);
        console.log('[OAuth Sync] Backend URL:', backendUrl);

        const response = await fetch(`${backendUrl}/users/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Critical: allows cookies to be set
          body: JSON.stringify({
            email: session.user.email,
            name: session.user.name,
          }),
        });

        console.log('[OAuth Sync] Response status:', response.status);
        console.log('[OAuth Sync] Response headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          const data = await response.json();
          console.log('[OAuth Sync] ✅ Success! User data:', data);
          console.log('[OAuth Sync] Cookie should now be set for localhost:4000');
          syncedRef.current = true;
        } else {
          const errorText = await response.text();
          console.error('[OAuth Sync] ❌ Failed:', response.status, errorText);
        }
      } catch (error) {
        console.error('[OAuth Sync] ❌ Network error:', error);
      }
    };

    syncWithBackend();
  }, [session, status]);
}
