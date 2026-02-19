'use client';

import { useTranslation } from 'react-i18next';
import { Download, AlertTriangle, Target, TrendingUp, Shield, BookOpen, ArrowRight, XCircle, ArrowUp } from 'lucide-react';
import { LocalizedLink } from '@/components/LocalizedLink';
import { ErrorBoundary } from '@/components/error-boundary';
import { useState, useEffect } from 'react';

// Fallback component for errors
function IntroErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-card p-8 max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold text-black dark:text-white">Failed to Load Introduction</h1>
        <p className="text-black/70 dark:text-white/70">Please try again or contact support.</p>
        <LocalizedLink href="/" className="glass-button inline-block px-6 py-3">
          Back to Home
        </LocalizedLink>
      </div>
    </div>
  );
}

function IntroductionContent() {
  const { t, i18n, ready } = useTranslation();
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Show back-to-top button after scrolling 300px
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-black dark:text-white">Loading...</div>
      </div>
    );
  }

  // Get current language with fallback
  const supportedLangs = ['en', 'ko'];
  const langCode = i18n.language?.split('-')[0] || 'en';
  const currentLang = supportedLangs.includes(langCode) ? langCode : 'en';
  const pdfUrl = `/glassbox-introduction-${currentLang}.pdf`;

  return (
    <main className="min-h-screen overflow-hidden">
      {/* Skip to main content (accessibility) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Fixed Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-cyan-300/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gold-300/5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative px-6 py-12 sm:py-20" id="main-content">
        <div className="mx-auto max-w-4xl space-y-16">

          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl sm:text-6xl font-bold text-black dark:text-white leading-tight">
              {t('introduction.hero.title')}
            </h1>
            <p className="text-xl text-black/70 dark:text-white/70 max-w-2xl mx-auto">
              {t('introduction.hero.subtitle')}
            </p>

            {/* Download PDF Button */}
            <div className="flex justify-center pt-4">
              <a
                href={pdfUrl}
                download
                className="glass-button-secondary inline-flex items-center gap-2 px-6 py-3"
                aria-label={`Download Glassbox introduction guide in ${currentLang === 'ko' ? 'Korean' : 'English'} (PDF)`}
              >
                <Download className="w-5 h-5" />
                <span>{t('introduction.downloadPdf')}</span>
              </a>
            </div>
          </div>

          {/* Disclaimers Section */}
          <section className="glass-card p-8 space-y-6 border-coral-500/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-coral-500 flex-shrink-0 mt-1" />
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-black dark:text-white">
                  {t('introduction.disclaimers.title')}
                </h2>
                <div className="space-y-4 text-black/70 dark:text-white/70">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-black dark:text-white">
                      {t('introduction.disclaimers.item1.title')}
                    </h3>
                    <p className="text-sm leading-relaxed">
                      {t('introduction.disclaimers.item1.content')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-black dark:text-white">
                      {t('introduction.disclaimers.item2.title')}
                    </h3>
                    <p className="text-sm leading-relaxed">
                      {t('introduction.disclaimers.item2.content')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-black dark:text-white">
                      {t('introduction.disclaimers.item3.title')}
                    </h3>
                    <p className="text-sm leading-relaxed">
                      {t('introduction.disclaimers.item3.content')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-black dark:text-white">
                      {t('introduction.disclaimers.item4.title')}
                    </h3>
                    <p className="text-sm leading-relaxed">
                      {t('introduction.disclaimers.item4.content')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-black dark:text-white">
                      {t('introduction.disclaimers.item5.title')}
                    </h3>
                    <p className="text-sm leading-relaxed">
                      {t('introduction.disclaimers.item5.content')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-black dark:text-white">
                      {t('introduction.disclaimers.item6.title')}
                    </h3>
                    <p className="text-sm leading-relaxed">
                      {t('introduction.disclaimers.item6.content')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-black dark:text-white">
                      {t('introduction.disclaimers.item7.title')}
                    </h3>
                    <p className="text-sm leading-relaxed">
                      {t('introduction.disclaimers.item7.content')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What is Glassbox Section */}
          <section className="glass-card p-8 space-y-6">
            <h2 className="text-3xl font-bold text-black dark:text-white">
              {t('introduction.whatIs.title')}
            </h2>
            <p className="text-lg text-black/70 dark:text-white/70 leading-relaxed">
              {t('introduction.whatIs.content')}
            </p>
          </section>

          {/* Three Core Features Section */}
          <section className="glass-card p-8 space-y-8">
            <h2 className="text-3xl font-bold text-black dark:text-white">
              {t('introduction.coreFeatures.title')}
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Feature 1: Efficient Frontier */}
              <div className="glass-card-gradient cyan-blue p-6 space-y-3">
                <div className="feature-icon">
                  <TrendingUp className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white">
                  {t('introduction.coreFeatures.feature1.title')}
                </h3>
                <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed">
                  {t('introduction.coreFeatures.feature1.content')}
                </p>
              </div>

              {/* Feature 2: Beta Calculation */}
              <div className="glass-card-gradient coral-pink p-6 space-y-3">
                <div className="feature-icon">
                  <Target className="w-8 h-8 text-coral-400" />
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white">
                  {t('introduction.coreFeatures.feature2.title')}
                </h3>
                <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed">
                  {t('introduction.coreFeatures.feature2.content')}
                </p>
              </div>

              {/* Feature 3: Hedging */}
              <div className="glass-card-gradient slate-glow p-6 space-y-3">
                <div className="feature-icon">
                  <Shield className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white">
                  {t('introduction.coreFeatures.feature3.title')}
                </h3>
                <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed">
                  {t('introduction.coreFeatures.feature3.content')}
                </p>
              </div>
            </div>
          </section>

          {/* Key Concepts Section */}
          <section className="glass-card p-8 space-y-8">
            <h2 className="text-3xl font-bold text-black dark:text-white">
              {t('introduction.keyConcepts.title')}
            </h2>

            {/* Efficient Frontier Concept */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                {t('introduction.keyConcepts.efficientFrontier.title')}
              </h3>
              <p className="text-black/70 dark:text-white/70 leading-relaxed">
                {t('introduction.keyConcepts.efficientFrontier.description')}
              </p>

              <div className="grid gap-4 md:grid-cols-3 mt-6">
                <div className="glass-card p-4 space-y-2">
                  <h4 className="font-bold text-black dark:text-white">
                    {t('introduction.keyConcepts.efficientFrontier.gmv.title')}
                  </h4>
                  <p className="text-sm text-black/70 dark:text-white/70">
                    {t('introduction.keyConcepts.efficientFrontier.gmv.description')}
                  </p>
                </div>
                <div className="glass-card p-4 space-y-2">
                  <h4 className="font-bold text-black dark:text-white">
                    {t('introduction.keyConcepts.efficientFrontier.maxSharpe.title')}
                  </h4>
                  <p className="text-sm text-black/70 dark:text-white/70">
                    {t('introduction.keyConcepts.efficientFrontier.maxSharpe.description')}
                  </p>
                </div>
                <div className="glass-card p-4 space-y-2">
                  <h4 className="font-bold text-black dark:text-white">
                    {t('introduction.keyConcepts.efficientFrontier.target.title')}
                  </h4>
                  <p className="text-sm text-black/70 dark:text-white/70">
                    {t('introduction.keyConcepts.efficientFrontier.target.description')}
                  </p>
                </div>
              </div>
            </div>

            {/* Beta Concept */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-coral-600 dark:text-coral-400">
                {t('introduction.keyConcepts.beta.title')}
              </h3>
              <p className="text-black/70 dark:text-white/70 leading-relaxed">
                {t('introduction.keyConcepts.beta.description')}
              </p>

              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <div className="glass-card p-4 space-y-2">
                  <div className="font-mono text-lg font-bold text-black dark:text-white">β = 1.0</div>
                  <p className="text-sm text-black/70 dark:text-white/70">
                    {t('introduction.keyConcepts.beta.beta1')}
                  </p>
                </div>
                <div className="glass-card p-4 space-y-2">
                  <div className="font-mono text-lg font-bold text-black dark:text-white">β = 1.5</div>
                  <p className="text-sm text-black/70 dark:text-white/70">
                    {t('introduction.keyConcepts.beta.beta1_5')}
                  </p>
                </div>
              </div>
            </div>

            {/* Hedging Concept */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                {t('introduction.keyConcepts.hedging.title')}
              </h3>
              <p className="text-black/70 dark:text-white/70 leading-relaxed">
                {t('introduction.keyConcepts.hedging.description')}
              </p>
            </div>
          </section>

          {/* How to Use Glassbox Section */}
          <section className="glass-card p-8 space-y-8">
            <h2 className="text-3xl font-bold text-black dark:text-white">
              {t('introduction.howToUse.title')}
            </h2>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 text-white font-bold text-xl flex items-center justify-center shadow-lg">
                    1
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-black dark:text-white">
                    {t('introduction.howToUse.step1.title')}
                  </h3>
                  <p className="text-black/70 dark:text-white/70 leading-relaxed">
                    {t('introduction.howToUse.step1.content')}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white font-bold text-xl flex items-center justify-center shadow-lg">
                    2
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-black dark:text-white">
                    {t('introduction.howToUse.step2.title')}
                  </h3>
                  <p className="text-black/70 dark:text-white/70 leading-relaxed">
                    {t('introduction.howToUse.step2.content')}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 text-white font-bold text-xl flex items-center justify-center shadow-lg">
                    3
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-black dark:text-white">
                    {t('introduction.howToUse.step3.title')}
                  </h3>
                  <p className="text-black/70 dark:text-white/70 leading-relaxed">
                    {t('introduction.howToUse.step3.content')}
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-coral-500 to-coral-600 text-white font-bold text-xl flex items-center justify-center shadow-lg">
                    4
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-black dark:text-white">
                    {t('introduction.howToUse.step4.title')}
                  </h3>
                  <p className="text-black/70 dark:text-white/70 leading-relaxed">
                    {t('introduction.howToUse.step4.content')}
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 text-white font-bold text-xl flex items-center justify-center shadow-lg">
                    5
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-black dark:text-white">
                    {t('introduction.howToUse.step5.title')}
                  </h3>
                  <p className="text-black/70 dark:text-white/70 leading-relaxed">
                    {t('introduction.howToUse.step5.content')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Known Limitations Section */}
          <section className="glass-card p-8 space-y-6">
            <h2 className="text-3xl font-bold text-black dark:text-white">
              {t('introduction.limitations.title')}
            </h2>

            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <XCircle className="w-5 h-5 text-coral-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-black dark:text-white">
                    {t('introduction.limitations.item1.title')}
                  </h3>
                  <p className="text-sm text-black/70 dark:text-white/70">
                    {t('introduction.limitations.item1.content')}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <XCircle className="w-5 h-5 text-coral-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-black dark:text-white">
                    {t('introduction.limitations.item2.title')}
                  </h3>
                  <p className="text-sm text-black/70 dark:text-white/70">
                    {t('introduction.limitations.item2.content')}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <XCircle className="w-5 h-5 text-coral-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-black dark:text-white">
                    {t('introduction.limitations.item3.title')}
                  </h3>
                  <p className="text-sm text-black/70 dark:text-white/70">
                    {t('introduction.limitations.item3.content')}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <XCircle className="w-5 h-5 text-coral-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-black dark:text-white">
                    {t('introduction.limitations.item4.title')}
                  </h3>
                  <p className="text-sm text-black/70 dark:text-white/70">
                    {t('introduction.limitations.item4.content')}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <XCircle className="w-5 h-5 text-coral-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-black dark:text-white">
                    {t('introduction.limitations.item5.title')}
                  </h3>
                  <p className="text-sm text-black/70 dark:text-white/70">
                    {t('introduction.limitations.item5.content')}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <XCircle className="w-5 h-5 text-coral-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-black dark:text-white">
                    {t('introduction.limitations.item6.title')}
                  </h3>
                  <p className="text-sm text-black/70 dark:text-white/70">
                    {t('introduction.limitations.item6.content')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="glass-panel p-8 sm:p-12 space-y-8 border-2 border-cyan-400/30">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-black dark:text-white">
                {t('introduction.cta.title')}
              </h2>
              <p className="text-lg text-black/70 dark:text-white/70 max-w-2xl mx-auto">
                {t('introduction.cta.subtitle')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LocalizedLink href="/portfolio/new" className="glass-button px-8 py-4 flex items-center justify-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{t('introduction.cta.startButton')}</span>
                <ArrowRight className="w-5 h-5" />
              </LocalizedLink>

              <a
                href={pdfUrl}
                download
                className="glass-button-secondary px-8 py-4 flex items-center justify-center gap-2"
                aria-label={`Download PDF guide in ${currentLang === 'ko' ? 'Korean' : 'English'}`}
              >
                <Download className="w-5 h-5" />
                <span>{t('introduction.cta.downloadButton')}</span>
              </a>
            </div>

            <p className="text-center text-sm text-black/50 dark:text-white/50 pt-4">
              {t('introduction.cta.disclaimer')}
            </p>
          </section>

        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 glass-button p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
          aria-label="Scroll back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </main>
  );
}

export default function IntroductionPage() {
  return (
    <ErrorBoundary fallback={<IntroErrorFallback />}>
      <IntroductionContent />
    </ErrorBoundary>
  );
}
