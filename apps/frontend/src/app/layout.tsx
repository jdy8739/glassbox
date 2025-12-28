import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from './providers';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('@/components/header').then(mod => ({ default: mod.Header })), {
  ssr: false,
  loading: () => <div className="h-16" />,
});

export const metadata: Metadata = {
  title: 'Glassbox - Portfolio Optimization Tool',
  description: 'Transparent portfolio optimization and beta hedging with Glass UI design',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
