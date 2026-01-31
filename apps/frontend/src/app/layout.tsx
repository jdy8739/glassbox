import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from './providers';
import { Header } from '@/components/header';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Glassbox - Portfolio Optimization Tool',
  description: 'Transparent portfolio optimization and beta hedging with Glass UI design',
  icons: {
    icon: '/favicon.svg',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  const lang = acceptLanguage.toLowerCase().includes('ko') ? 'ko' : 'en';

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{const t=localStorage.getItem('theme')||'system';const d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <ThemeProvider lang={lang}>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
