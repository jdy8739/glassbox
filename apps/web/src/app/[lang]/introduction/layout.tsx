import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Introduction - Glassbox Portfolio Optimization',
  description: 'Learn everything about Glassbox: portfolio optimization, efficient frontier analysis, beta hedging, and market-neutral strategies. Complete guide with step-by-step instructions.',
  openGraph: {
    title: 'Glassbox Introduction Guide',
    description: 'Master portfolio optimization with our comprehensive introduction to efficient frontier, beta calculation, and hedging strategies.',
    images: ['/og-image.png'],
  },
};

export default function IntroductionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
