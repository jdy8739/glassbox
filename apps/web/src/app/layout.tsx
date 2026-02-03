import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Glassbox',
  description: 'Portfolio optimization and beta hedging',
};

/**
 * Root Layout - Minimal HTML Shell
 *
 * Language-specific layouts are in app/[lang]/layout.tsx
 * This layout only provides the base HTML structure.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
