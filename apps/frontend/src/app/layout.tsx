import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Glassbox - Portfolio Optimization Tool',
  description: 'Transparent portfolio optimization and beta hedging with Glass UI design',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
