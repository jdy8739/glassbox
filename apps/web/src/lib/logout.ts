import { signOut } from 'next-auth/react';

/**
 * Properly logout by clearing sessions and auth-related data
 *
 * Order of operations:
 * 1. Backend logout (clears backend httpOnly cookies)
 * 2. NextAuth signOut (clears NextAuth httpOnly cookies)
 *
 * Note: httpOnly cookies can only be cleared by the server via proper endpoints.
 */
export async function logout(options?: { redirect?: boolean; callbackUrl?: string }) {
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

  // Step 2: NextAuth signOut
  // In NextAuth v5, if redirect is false, we need to call signOut without redirect
  if (options?.redirect === false) {
    // Call signOut and prevent automatic redirect by catching the redirect
    await signOut({ redirect: false } as any);
  } else {
    // Default behavior: redirect after logout
    await signOut({ redirectTo: options?.callbackUrl || '/' } as any);
  }
}
