'use client';
import { useTranslation } from 'react-i18next';
import { Sparkles, TrendingUp, Zap, Lock, BarChart3, Shield, Gem, Package, Microscope, BookOpen, Github, Mail, ExternalLink } from 'lucide-react';
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
      <div className="relative px-6 py-28 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-cyan-300/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="mx-auto max-w-5xl relative z-10">
          {/* Section Header */}
          <div className="text-center mb-24 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/50 backdrop-blur-sm">
              <span className="text-sm font-semibold text-cyan-900 dark:text-cyan-100">{t('howitworks.section-header')}</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold">
              <span className="text-black dark:text-white">{t('howitworks.title.how')} </span>
              <span className="bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                {t('howitworks.title.works')}
              </span>
            </h2>
          </div>

          {/* Steps Container with Connecting Line */}
          <div className="relative space-y-6">
            {/* Vertical Connecting Line (hidden on mobile) */}
            <div className="hidden sm:block absolute left-[27px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-cyan-500 opacity-30"></div>

            {/* Step 1 */}
            <div className="flex gap-8 items-start group">
              <div className="flex-shrink-0 relative z-10">
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-cyan-600 text-white font-bold text-xl shadow-lg group-hover:shadow-cyan-500/50 transition-all group-hover:scale-110">
                  <BarChart3 className="w-7 h-7" />
                </div>
              </div>
              <div className="flex-1 glass-card p-8 group-hover:border-cyan-400/50 transition-all transform group-hover:scale-105">
                <h3 className="text-2xl font-bold text-black dark:text-white mb-3">{t('howitworks.step1.title')}</h3>
                <p className="text-lg text-black/70 dark:text-white/70 leading-relaxed">
                  {t('howitworks.step1.desc')}
                </p>
                <div className="mt-4 inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-900 dark:text-cyan-100 text-xs font-semibold">
                  {t('howitworks.step-badge.one')}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-8 items-start group">
              <div className="flex-shrink-0 relative z-10">
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 text-white font-bold text-xl shadow-lg group-hover:shadow-purple-500/50 transition-all group-hover:scale-110">
                  <Zap className="w-7 h-7" />
                </div>
              </div>
              <div className="flex-1 glass-card p-8 group-hover:border-purple-400/50 transition-all transform group-hover:scale-105">
                <h3 className="text-2xl font-bold text-black dark:text-white mb-3">{t('howitworks.step2.title')}</h3>
                <p className="text-lg text-black/70 dark:text-white/70 leading-relaxed">
                  {t('howitworks.step2.desc')}
                </p>
                <div className="mt-4 inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-900 dark:text-purple-100 text-xs font-semibold">
                  {t('howitworks.step-badge.two')}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-8 items-start group">
              <div className="flex-shrink-0 relative z-10">
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-cyan-600 text-white font-bold text-xl shadow-lg group-hover:shadow-cyan-500/50 transition-all group-hover:scale-110">
                  <Shield className="w-7 h-7" />
                </div>
              </div>
              <div className="flex-1 glass-card p-8 group-hover:border-cyan-400/50 transition-all transform group-hover:scale-105">
                <h3 className="text-2xl font-bold text-black dark:text-white mb-3">{t('howitworks.step3.title')}</h3>
                <p className="text-lg text-black/70 dark:text-white/70 leading-relaxed">
                  {t('howitworks.step3.desc')}
                </p>
                <div className="mt-4 inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-900 dark:text-cyan-100 text-xs font-semibold">
                  {t('howitworks.step-badge.three')}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Complete Indicator */}
          <div className="mt-16 text-center">
            <p className="text-black/60 dark:text-white/60 text-lg">
              {t('howitworks.timeline-complete')} <span className="font-bold text-black dark:text-white">{t('howitworks.timeline-complete-sub')}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative px-6 py-28 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-cyan-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="mx-auto max-w-4xl relative z-10">
          {/* Outer Gradient Ring */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-60"></div>

          {/* Main Panel */}
          <div className="relative glass-panel p-8 sm:p-12 lg:p-16 space-y-10 border-2 border-cyan-400/30 dark:border-cyan-300/30">

            {/* Top Accent */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/50">
                <Sparkles className="w-4 h-4 text-cyan-500 animate-pulse" />
                <span className="text-sm font-semibold text-cyan-900 dark:text-cyan-100">{t('cta.ready')}</span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h2 className="text-5xl sm:text-6xl font-bold text-center">
                <span className="bg-gradient-to-r from-black via-cyan-600 to-black dark:from-white dark:via-cyan-300 dark:to-white bg-clip-text text-transparent">
                  {t('cta.optimize')}
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-black/60 dark:text-white/70 max-w-2xl mx-auto text-center leading-relaxed">
                {t('cta.description')}
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6 border-y border-black/10 dark:border-white/10">
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">3</div>
                <p className="text-xs text-black/60 dark:text-white/60">{t('cta.feature-count')}</p>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">∞</div>
                <p className="text-xs text-black/60 dark:text-white/60">{t('cta.portfolio-count')}</p>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">100%</div>
                <p className="text-xs text-black/60 dark:text-white/60">{t('cta.transparency-percent')}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <LocalizedLink href="/portfolio/new" className="group glass-button text-lg px-8 sm:px-12 py-4 hover:scale-105 transition-transform flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-xl">
                <Zap className="w-5 h-5 group-hover:animate-spin" />
                <span>{t('cta.launch')}</span>
              </LocalizedLink>
              <a href="/glassbox-introduction.pdf" download className="text-lg px-8 sm:px-12 py-4 hover:scale-105 transition-transform flex items-center justify-center gap-2 text-slate-900 dark:text-white bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-sm shadow-sm rounded-lg" title="Download introduction PDF">
                <BookOpen className="w-5 h-5" />
                <span>{t('cta.learn')}</span>
              </a>
            </div>

            {/* Bottom Trust Text */}
            <p className="text-center text-sm text-black/50 dark:text-white/50 pt-4">
              Start optimizing your portfolio with transparency and precision
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative px-6 py-20 bg-gradient-to-b from-transparent via-cyan-500/5 to-cyan-500/10 dark:via-cyan-400/5 dark:to-cyan-400/10">
        <div className="mx-auto max-w-6xl">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

            {/* Brand Section */}
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-black via-cyan-600 to-black dark:from-white dark:via-cyan-300 dark:to-white bg-clip-text text-transparent">
                  Glassbox
                </h3>
                <p className="text-black/60 dark:text-white/60 text-sm mt-2">{t('footer.description')}</p>
              </div>
              <div className="flex gap-3">
                <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"></div>
                <div className="h-1 w-8 bg-cyan-400/50 rounded-full"></div>
              </div>
            </div>

            {/* Resources */}
            <div className="flex flex-col gap-4">
              <h4 className="text-lg font-semibold text-black dark:text-white">Resources</h4>
              <nav className="flex flex-col gap-3">
                <a href="/glassbox-introduction.pdf" download className="group flex items-center gap-2 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-cyan-300 transition-colors font-medium text-sm">
                  <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{t('footer.docs')}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a href="https://github.com/jdy8739/glassbox" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-cyan-300 transition-colors font-medium text-sm">
                  <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{t('footer.github')}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </nav>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-4">
              <h4 className="text-lg font-semibold text-black dark:text-white">Get in Touch</h4>
              <a href="mailto:jdy8739@naver.com" className="group flex items-center gap-2 px-4 py-3 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-cyan-500 dark:hover:border-cyan-400 hover:bg-cyan-500/10 transition-all">
                <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-black dark:text-white/80 font-medium text-sm">{t('footer.contact')}</span>
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent mb-8"></div>

          {/* Bottom Footer */}
          <div className="flex justify-center items-center text-center">
            <p className="text-black/50 dark:text-white/50 text-xs" suppressHydrationWarning>
              © {new Date().getFullYear()} Glassbox. Built with transparency and precision.
            </p>
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
