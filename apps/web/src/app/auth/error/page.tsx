import { Suspense } from 'react';
import { redirect } from 'next/navigation';

/**
 * NextAuth error page
 * Handles authentication errors and redirects to language-specific login
 */
export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams.error || 'unknown';

  // Log the error for debugging
  console.error('Auth error:', error);

  // Redirect to language-specific login page with error
  // Use 'en' as default, or detect from user preferences
  redirect(`/en/login?error=${error}`);
}
