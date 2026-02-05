'use client';
import { useTranslation } from 'react-i18next';
import { Sparkles, TrendingUp, Zap, Lock, BarChart3, Shield, Gem, Package, Microscope, BookOpen } from 'lucide-react';
import { HeroVisual } from '@/components/landing/hero-visual';
import { ErrorBoundary } from '@/components/error-boundary';
import { LandingErrorFallback } from '@/components/landing/LandingErrorFallback';
import { LocalizedLink } from '@/components/LocalizedLink';



function HomeContent() {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-cyan-300/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gold-300/5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Hero Section */}
      <div className="relative px-6 py-12 sm:py-20 md:py-28 lg:py-32">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Column: Text Content */}
          <div className="space-y-10 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-black/80 dark:text-white/80">{t('hero.badge')}</span>
            </div>

            {/* Hero Title */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black dark:text-white leading-[1.1] tracking-tight">
                {t('hero.title.part1')}
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                  {t('hero.title.part2')}
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-black/60 dark:text-white/60 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {t('hero.description')}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <LocalizedLink href="/portfolio/new" className="glass-button text-lg px-8 py-4 hover:scale-105 flex items-center justify-center gap-2 group">
                <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                <span>{t('hero.cta.start')}</span>
              </LocalizedLink>
              <LocalizedLink href="/portfolios" className="glass-button text-lg px-8 py-4 hover:scale-105 flex items-center justify-center gap-2 text-slate-900 dark:text-white bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-sm shadow-sm transition-all">
                <TrendingUp className="w-5 h-5" />
                <span>{t('hero.cta.library')}</span>
              </LocalizedLink>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 flex flex-wrap justify-center lg:justify-start gap-6 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-500" />
                <span className="text-black/70 dark:text-white/70 font-medium">{t('hero.trust.instant')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-500" />
                <span className="text-black/70 dark:text-white/70 font-medium">{t('hero.trust.local')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Mockup */}
          <div className="hidden lg:block relative z-10 perspective-1000">
             <HeroVisual />
          </div>
        </div>
      </div>

{/* Features Section */}
      <div className="relative px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-5xl sm:text-6xl font-bold text-black dark:text-white">
              {t('features.title.intelligent')} <span className="bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">{t('features.title.features')}</span>
            </h2>
            <p className="text-xl text-black/60 dark:text-white/60 max-w-2xl mx-auto">
              {t('features.description')}
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 - Purple Blue */}
            <div className="glass-card-gradient cyan-blue group cursor-pointer transform transition-all hover:scale-105">
              <div className="feature-icon group-hover:scale-110 transition-transform"><BarChart3 className="w-8 h-8 text-cyan-400" /></div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-3">{t('features.card1.title')}</h3>
              <p className="text-black dark:text-white/70 leading-relaxed mb-4 text-sm">
                {t('features.card1.desc')}
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="glass-badge text-xs">GMV</span>
                <span className="glass-badge text-xs">Max Sharpe</span>
                <span className="glass-badge text-xs">Weights</span>
              </div>
            </div>

            {/* Card 2 - Coral Pink */}
            <div className="glass-card-gradient coral-pink group cursor-pointer transform transition-all hover:scale-105">
              <div className="feature-icon group-hover:scale-110 transition-transform"><Shield className="w-8 h-8 text-coral-400" /></div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-3">{t('features.card2.title')}</h3>
              <p className="text-black dark:text-white/70 leading-relaxed mb-4 text-sm">
                {t('features.card2.desc')}
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="glass-badge coral text-xs">SPY</span>
                <span className="glass-badge coral text-xs">Futures</span>
                <span className="glass-badge coral text-xs">ES</span>
              </div>
            </div>

            {/* Card 3 - Gold Cyan */}
            <div className="glass-card-gradient slate-glow group cursor-pointer transform transition-all hover:scale-105">
              <div className="feature-icon group-hover:scale-110 transition-transform"><Gem className="w-8 h-8 text-slate-400" /></div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-3">{t('features.card3.title')}</h3>
              <p className="text-black dark:text-white/70 leading-relaxed mb-4 text-sm">
                {t('features.card3.desc')}
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="glass-badge slate text-xs">Glass</span>
                <span className="glass-badge slate text-xs">Smooth</span>
                <span className="glass-badge slate text-xs">Responsive</span>
              </div>
            </div>

            {/* Card 4 - Indigo Green */}
            <div className="glass-card-gradient cyan-blue group cursor-pointer transform transition-all hover:scale-105">
              <div className="feature-icon group-hover:scale-110 transition-transform"><Zap className="w-8 h-8 text-cyan-400" /></div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-3">{t('features.card4.title')}</h3>
              <p className="text-black dark:text-white/70 leading-relaxed mb-4 text-sm">
                {t('features.card4.desc')}
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="glass-badge text-xs">Fast</span>
                <span className="glass-badge text-xs">Accurate</span>
                <span className="glass-badge text-xs">Live</span>
              </div>
            </div>

            {/* Card 5 - Purple Blue */}
            <div className="glass-card-gradient cyan-blue group cursor-pointer transform transition-all hover:scale-105">
              <div className="feature-icon group-hover:scale-110 transition-transform"><Package className="w-8 h-8 text-cyan-400" /></div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-3">{t('features.card5.title')}</h3>
              <p className="text-black dark:text-white/70 leading-relaxed mb-4 text-sm">
                {t('features.card5.desc')}
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="glass-badge purple text-xs">Save</span>
                <span className="glass-badge purple text-xs">Export</span>
                <span className="glass-badge purple text-xs">Compare</span>
              </div>
            </div>

            {/* Card 6 - Coral Pink */}
            <div className="glass-card-gradient coral-pink group cursor-pointer transform transition-all hover:scale-105">
              <div className="feature-icon group-hover:scale-110 transition-transform"><Microscope className="w-8 h-8 text-coral-400" /></div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-3">{t('features.card6.title')}</h3>
              <p className="text-black dark:text-white/70 leading-relaxed mb-4 text-sm">
                {t('features.card6.desc')}
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="glass-badge coral text-xs">Metrics</span>
                <span className="glass-badge coral text-xs">Stats</span>
                <span className="glass-badge coral text-xs">Insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative px-6 py-28 bg-black/5 dark:bg-white/5">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-5xl font-bold text-black dark:text-white text-center mb-20">
            {t('howitworks.title.how')} <span className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">{t('howitworks.title.works')}</span>
          </h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="min-w-fit">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }}>
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-black dark:text-white mb-2">{t('howitworks.step1.title')}</h3>
                <p className="text-black dark:text-white/70">
                  {t('howitworks.step1.desc')}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="min-w-fit">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }}>
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-black dark:text-white mb-2">{t('howitworks.step2.title')}</h3>
                <p className="text-black dark:text-white/70">
                  {t('howitworks.step2.desc')}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="min-w-fit">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }}>
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-black dark:text-white mb-2">{t('howitworks.step3.title')}</h3>
                <p className="text-black dark:text-white/70">
                  {t('howitworks.step3.desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative px-6 py-28">
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-300/10 via-cyan-300/10 to-gold-300/10 rounded-3xl blur-xl"></div>
            <div className="glass-panel p-12 sm:p-16 text-center space-y-8 relative">
              <h2 className="text-5xl font-bold text-black dark:text-white">
                {t('cta.ready')} <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">{t('cta.optimize')}</span>
              </h2>
              <p className="text-xl text-black dark:text-white/70 max-w-xl mx-auto">
                {t('cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <LocalizedLink href="/portfolio/new" className="glass-button text-lg px-10 py-4 hover:scale-105 transition-transform flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span>{t('cta.launch')}</span>
                </LocalizedLink>
                <a href="#features" className="glass-button text-lg px-10 py-4 hover:scale-105 transition-transform flex items-center justify-center gap-2 text-slate-900 dark:text-white bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-sm shadow-sm">
                  <BookOpen className="w-5 h-5" />
                  <span>{t('cta.learn')}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative px-6 py-12 border-t border-white/10">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-8 text-center sm:text-left">
          <div>
            <h3 className="text-2xl font-bold text-black dark:text-white mb-1">Glassbox</h3>
            <p className="text-black dark:text-white/50 text-sm">{t('footer.description')}</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-black dark:text-white/60 hover:text-black dark:hover:text-white transition">{t('footer.docs')}</a>
            <a href="https://github.com/jdy8739/glassbox" target="_blank" rel="noopener noreferrer" className="text-black dark:text-white/60 hover:text-black dark:hover:text-white transition">{t('footer.github')}</a>
            <a href="mailto:jdy8739@naver.com" className="text-black dark:text-white/60 hover:text-black dark:hover:text-white transition">{t('footer.contact')}</a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <ErrorBoundary fallback={<LandingErrorFallback />}>
      <HomeContent />
    </ErrorBoundary>
  );
}
