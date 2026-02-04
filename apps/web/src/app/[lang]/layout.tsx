import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ThemeProvider } from '../providers';
import { Header } from '@/components/header';
import { SUPPORTED_LANGUAGES, isSupportedLanguage, type Language } from '@/lib/i18n/config';
import { auth } from '@/lib/auth';

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

/**
 * Generate static params for all supported languages
 * This enables static generation at build time
 */
export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({
    lang,
  }));
}

/**
 * Generate metadata based on language
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<Language, string> = {
    en: 'Glassbox - Portfolio Optimization Tool',
    ko: 'Glassbox - 포트폴리오 최적화 도구',
  };

  const descriptions: Record<Language, string> = {
    en: 'Transparent portfolio optimization and beta hedging with Glass UI design. Calculate efficient frontiers, optimize allocations, and hedge market risk.',
    ko: '투명한 포트폴리오 최적화 및 베타 헤징 - Glass UI 디자인. 효율적 투자선을 계산하고, 자산 배분을 최적화하며, 시장 리스크를 헤징하세요.',
  };

  // Use absolute URLs for better SEO (requires NEXT_PUBLIC_SITE_URL env variable)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://glassbox.app';

  return {
    title: titles[lang as Language] || titles.en,
    description: descriptions[lang as Language] || descriptions.en,
    icons: {
      icon: '/favicon.svg',
    },
    alternates: {
      languages: {
        en: `${siteUrl}/en`,
        ko: `${siteUrl}/ko`,
      },
    },
    openGraph: {
      title: titles[lang as Language] || titles.en,
      description: descriptions[lang as Language] || descriptions.en,
      url: `${siteUrl}/${lang}`,
      siteName: 'Glassbox',
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang as Language] || titles.en,
      description: descriptions[lang as Language] || descriptions.en,
    },
  };
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;

  // Validate language - return 404 if not supported
  if (!isSupportedLanguage(lang)) {
    notFound();
  }

  // Get session on server side for proper hydration
  const session = await auth();

  // Use absolute URLs for hreflang tags (better SEO)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://glassbox.app';

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* hreflang tags for SEO - must use absolute URLs */}
        <link rel="alternate" hrefLang="en" href={`${siteUrl}/en`} />
        <link rel="alternate" hrefLang="ko" href={`${siteUrl}/ko`} />
        <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/en`} />

        {/* Theme initialization script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{const t=localStorage.getItem('theme')||'system';const d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <ThemeProvider lang={lang} session={session}>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
