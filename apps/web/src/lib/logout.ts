import { signOut, type SignOutParams } from 'next-auth/react';

/**
 * Properly logout by clearing sessions and auth-related data
 *
 * Order of operations:
 * 1. Backend logout (clears backend httpOnly cookies)
 * 2. NextAuth signOut (clears NextAuth httpOnly cookies)
 * 3. Clear client-side cache
 *
 * Note: httpOnly cookies can only be cleared by the server via proper endpoints.
 */
export async function logout(options?: SignOutParams) {
  // Step 1: Backend logout - Clear backend session cookies (httpOnly accessToken)
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (backendUrl) {
      const response = await fetch(`${backendUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Sends httpOnly cookies to backend
      });

      if (!response.ok) {
        console.warn('[Logout] Backend logout returned error:', response.status);
      }
    }
  } catch (e) {
    console.warn('[Logout] Backend logout failed:', e);
    // Continue anyway - user still wants to logout from frontend
  }

  // Step 2: NextAuth signOut - This makes POST to /auth/signout
  // which clears NextAuth httpOnly cookies server-side
  await signOut(options);

  // Note: We do NOT clear localStorage because:
  // - Auth uses httpOnly cookies (no tokens in localStorage)
  // - Theme preference should persist across sessions
  // - Portfolio data is not auth-specific (user might want to keep it)
}
