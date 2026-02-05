'use client';

import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  TrendingUp,
  Lightbulb,
  MapPin,
  Rocket,
  Layers,
  AlertCircle,
  Info,
} from 'lucide-react';
import { useEffect, useRef, useState, Suspense } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { usePortfolioBuilder } from './usePortfolioBuilder';
import { AssetList } from './components/AssetList';
import { StarterTemplates } from './components/StarterTemplates';
import { QuickAddAssets } from './components/QuickAddAssets';
import { HeaderPortal } from '@/lib/header-context';
import { ErrorBoundary } from '@/components/error-boundary';
import { BackButton } from '@/components/back-button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Tooltip } from '@/components/Tooltip';
import { useLocalizedRouter } from '@/hooks/useLocalizedRouter';
import { validatePortfolioAnalysis, isEndDateToday } from '@/lib/portfolio-validation';

const PortfolioDonutChart = dynamic(
  () => import('./components/PortfolioDonutChart').then((mod) => mod.PortfolioDonutChart),
  {
    loading: () => (
      <div className="w-full h-[250px] flex items-center justify-center">
        <div className="w-48 h-48 rounded-full border-[16px] border-black/5 dark:border-white/5 animate-pulse" />
      </div>
    ),
    ssr: false,
  }
);

const CHART_COLORS = [
  '#06b6d4', // Cyan 500
  '#f472b6', // Pink 400
  '#a78bfa', // Violet 400
  '#fbbf24', // Amber 400
  '#34d399', // Emerald 400
  '#60a5fa', // Blue 400
];

function BuilderErrorFallback() {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen px-6 py-8 flex items-center justify-center">
      <div className="glass-panel p-8 max-w-md w-full text-center space-y-6 border-orange-500/20 bg-orange-500/5">
        <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-black dark:text-white mb-2">
            {t('portfolio.builder.error.title')}
          </h2>
          <p className="text-sm text-black/60 dark:text-white/60">
            {t('portfolio.builder.error.description')}
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => (window.location.href = '/')}
            className="px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <span>{t('common.button.back-home')}</span>
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm font-medium shadow-lg shadow-orange-500/20"
          >
            <Rocket className="w-4 h-4" />
            {t('common.button.retry')}
          </button>
        </div>
      </div>
    </main>
  );
}

function PortfolioBuilderContent() {
  const { t } = useTranslation();
  const router = useLocalizedRouter();
  const { status } = useSession();

  // Portfolio builder hook (CRUD only)
  const {
    items,
    dateRange,
    setDateRange,
    searchInput,
    setSearchInput,
    searchResults,
    isSearching,
    showDropdown,
    setShowDropdown,
    addItem,
    loadTemplate,
    removeItem,
    updateQuantity,
    saveDraft,
  } = usePortfolioBuilder();

  // UI state (dialogs)
  const [showTodayWarning, setShowTodayWarning] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Dropdown UI state
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  // Authentication status
  const isAuthenticated = status === 'authenticated';

  // Validation (computed from current state)
  const validationError = validatePortfolioAnalysis(items, dateRange, t);

  // Navigation helper
  const navigateToResults = () => {
    const nonZeroItems = items.filter(item => item.quantity > 0);
    const params = new URLSearchParams({
      tickers: nonZeroItems.map(item => item.symbol).join(','),
      quantities: nonZeroItems.map(item => item.quantity).join(','),
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });
    router.push(`/analysis/result?${params}`);
  };

  // Analyze handler (orchestrates validation, auth, and navigation)
  const handleAnalyze = () => {
    if (items.length === 0) return;

    // Validate inputs
    if (validationError) return;

    // Check authentication - save and show dialog if not authenticated
    if (!isAuthenticated) {
      saveDraft();
      setShowAuthDialog(true);
      return;
    }

    // Check if end date is today (show confirmation dialog)
    if (isEndDateToday(dateRange)) {
      setShowTodayWarning(true);
      return;
    }

    // Navigate to results page
    navigateToResults();
  };

  // Confirm today warning handler
  const handleConfirmTodayWarning = () => {
    setShowTodayWarning(false);
    navigateToResults();
  };

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchRef = useRef<HTMLDivElement>(null);

  const inputWrapperRef = useRef<HTMLDivElement>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const resultRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Reset selected index when results change

  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchResults]);

  // Auto-show dropdown when results arrive or input changes

  useEffect(() => {
    if (searchResults.length > 0 && searchInput.length >= 1) {
      setShowDropdown(true);
    } else if (searchInput.length < 1) {
      setShowDropdown(false);
    }
  }, [searchResults, searchInput, setShowDropdown]);

  // Update dropdown position

  useEffect(() => {
    const updatePosition = () => {
      if (inputWrapperRef.current) {
        const rect = inputWrapperRef.current.getBoundingClientRect();

        setDropdownPosition({
          top: rect.bottom + window.scrollY + 8, // 8px gap

          left: rect.left + window.scrollX,

          width: rect.width,
        });
      }
    };

    if (showDropdown) {
      updatePosition();

      window.addEventListener('resize', updatePosition);

      window.addEventListener('scroll', updatePosition);

      return () => {
        window.removeEventListener('resize', updatePosition);

        window.removeEventListener('scroll', updatePosition);
      };
    }

    return undefined;
  }, [showDropdown]);

  // Close dropdown when clicking outside

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowDropdown]);

  const handleAddItem = (symbol: string, name?: string) => {
    if (addItem(symbol)) {
      // Smooth scroll happens via React state update, no need for manual scroll
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || searchResults.length === 0) {
      if (e.key === 'Enter' && searchInput) {
        e.preventDefault();

        handleAddItem(searchInput);
      }

      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();

        setSelectedIndex((prev) => {
          const next = prev + 1;

          if (next >= searchResults.length) return 0;

          resultRefs.current[next]?.scrollIntoView({ block: 'nearest' });

          return next;
        });

        break;

      case 'ArrowUp':
        e.preventDefault();

        setSelectedIndex((prev) => {
          const next = prev - 1;

          if (next < 0) return searchResults.length - 1;

          resultRefs.current[next]?.scrollIntoView({ block: 'nearest' });

          return next;
        });

        break;

      case 'Enter':
        e.preventDefault();

        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          const selected = searchResults[selectedIndex];

          handleAddItem(selected.symbol, selected.name);
        } else if (searchInput) {
          handleAddItem(searchInput);
        }

        break;

      case 'Escape':
        setShowDropdown(false);

        break;
    }
  };

  return (
    <main className="min-h-screen px-6 pt-8 pb-32">
      <HeaderPortal
        nav={<BackButton href="/" />}
        actions={
          <button
            onClick={handleAnalyze}
            disabled={items.length === 0}
            className="hidden lg:flex h-9 px-3 items-center gap-2 rounded-lg text-xs font-medium text-slate-700 dark:text-white/80 bg-white/10 dark:bg-slate-800/50 border border-black/5 dark:border-white/10 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrendingUp className="w-5 h-5" />
            <span>{t('nav.analyze')}</span>
          </button>
        }
      />

      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Workbench (8 cols) */}

          <div className="lg:col-span-8 space-y-10">
            {/* Header Section */}

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>

                <span className="text-sm font-medium text-black dark:text-white/80">
                  {t('portfolio.builder.step')}
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl font-bold text-black dark:text-white">
                  {t('portfolio.builder.title.part1')}

                  <br />

                  <span className="bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                    {t('portfolio.builder.title.part2')}
                  </span>
                </h1>

                <p className="text-xl text-black dark:text-white/70 max-w-2xl">
                  {t('portfolio.builder.description')}
                </p>
              </div>
            </div>

            {/* Search Bar */}

            <div className="glass-card-gradient cyan-blue overflow-visible relative z-30">
              <div className="space-y-4 overflow-visible">
                <label className="flex items-center gap-2 text-sm font-semibold text-black dark:text-white">
                  <MapPin className="w-4 h-4" />

                  {t('portfolio.builder.search.label')}
                </label>

                <div className="relative overflow-visible" ref={searchRef}>
                  <div className="flex gap-3" ref={inputWrapperRef}>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onFocus={() => {
                          if (searchResults.length > 0) setShowDropdown(true);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={t('portfolio.builder.search.placeholder')}
                        className="glass-input w-full text-lg pr-10"
                      />

                      {isSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddItem(searchInput)}
                      className="glass-button whitespace-nowrap"
                    >
                      {t('portfolio.builder.search.add')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Add Assets */}

            <QuickAddAssets onAdd={handleAddItem} />

            {/* Mobile Analysis Settings */}
            <div className="lg:hidden glass-card-gradient cyan-blue">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-black dark:text-white">
                  <Lightbulb className="w-4 h-4 text-cyan-500" />
                  {t('portfolio.builder.analysis.settings.label')}
                  <Tooltip content={t('portfolio.builder.analysis.settings.tooltip')} width={250}>
                    <Info className="w-4 h-4 text-black/40 dark:text-white/40 cursor-help" />
                  </Tooltip>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-black/60 dark:text-white/60 mb-2">
                      {t('portfolio.builder.analysis.settings.start-date')}
                    </p>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                      className="w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-black/60 dark:text-white/60 mb-2">
                      {t('portfolio.builder.analysis.settings.end-date')}
                    </p>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                      className="w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}

            <div className="space-y-6">
              {items.length === 0 ? (
                /* Empty State: Starter Templates */

                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-2 text-black dark:text-white">
                    <Sparkles className="w-5 h-5 text-cyan-400" />

                    <h3 className="text-lg font-semibold">
                      {t('portfolio.builder.templates.title')}
                    </h3>
                  </div>

                  <StarterTemplates onSelect={loadTemplate} />
                </div>
              ) : (
                /* List of Assets */

                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-black dark:text-white flex items-center gap-2">
                      <Layers className="w-4 h-4" />

                      {t('portfolio.builder.assets.label')}
                    </label>

                    <button
                      onClick={() => loadTemplate([])}
                      className="text-xs text-red-400 hover:text-red-500 transition-colors"
                    >
                      {t('portfolio.builder.assets.clear')}
                    </button>
                  </div>

                  <AssetList
                    items={items}
                    colors={CHART_COLORS}
                    onRemove={removeItem}
                    onUpdateQuantity={updateQuantity}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Summary Panel (4 cols) */}

          <div className="hidden lg:block lg:col-span-4 sticky top-24">
            <div className="glass-panel p-6 space-y-6">
              <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />

                {t('portfolio.builder.preview.title')}
              </h3>

              {/* Donut Chart */}
              <PortfolioDonutChart items={items} colors={CHART_COLORS} />

              {/* Stats Summary */}
              {items.length > 0 && (
                <div className="grid grid-cols-2 gap-3 py-4 border-t border-b border-black/10 dark:border-white/10">
                  <div>
                    <p className="text-xs text-black/50 dark:text-white/50">
                      {t('portfolio.builder.preview.total')}
                    </p>
                    <p className="text-lg font-bold text-black dark:text-white">{items.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 dark:text-white/50">
                      {t('portfolio.builder.preview.value')}
                    </p>
                    <p className="text-lg font-bold text-black dark:text-white">00k</p>
                  </div>
                </div>
              )}

              {/* Analysis Settings */}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-black dark:text-white flex items-center gap-2">
                  <Lightbulb className="w-3 h-3 text-cyan-500" />
                  {t('portfolio.builder.analysis.settings.label')}
                  <Tooltip content={t('portfolio.builder.analysis.settings.tooltip')} width={250}>
                    <Info className="w-3 h-3 text-black/40 dark:text-white/40 cursor-help" />
                  </Tooltip>
                </label>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-black/60 dark:text-white/60 mb-1">
                      {t('portfolio.builder.analysis.settings.start-date')}
                    </p>

                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                      className="w-full bg-black/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-black/60 dark:text-white/60 mb-1">
                      {t('portfolio.builder.analysis.settings.end-date')}
                    </p>

                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                      className="w-full bg-black/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Main CTA */}

              <button
                onClick={handleAnalyze}
                disabled={items.length === 0 || !!validationError}
                className="w-full glass-button text-lg py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                <span>{t('portfolio.builder.analyze.button')}</span>
              </button>

              {validationError && (
                <div className="flex items-center justify-center gap-2 mt-4 px-4 py-2.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-800/30 backdrop-blur-sm">
                  <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 flex-shrink-0" />
                  <p className="text-sm text-rose-700 dark:text-rose-300 font-normal">
                    {validationError}
                  </p>
                </div>
              )}
            </div>

            {/* Helper Tip */}
            <div className="mt-3 glass-panel p-4 rounded-xl">
              <div className="flex gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <p className="text-xs text-black/70 dark:text-white/70 leading-relaxed">
                  <strong>{t('portfolio.builder.tip.title')}</strong>{' '}
                  {t('portfolio.builder.tip.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Bar */}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-white/20 z-50 lg:hidden">
        <div className="flex items-center gap-4 max-w-lg mx-auto">
          <div className="flex-1">
            <p className="text-xs text-black/50 dark:text-white/50 font-medium">
              {t('portfolio.builder.summary.label')}
            </p>

            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-black dark:text-white">
                {items.length} {t('portfolio.builder.summary.assets')}
              </span>

              <span className="text-sm text-black/60 dark:text-white/60">~ 00k</span>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={items.length === 0}
            className="glass-button px-6 py-3 flex items-center gap-2 disabled:opacity-50"
          >
            <Rocket className="w-4 h-4" />
            <span>{t('nav.analyze')}</span>
          </button>
        </div>
      </div>

      {/* Portal-based Dropdown */}

      {typeof window !== 'undefined' &&
        showDropdown &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',

              top: `${dropdownPosition.top}px`,

              left: `${dropdownPosition.left}px`,

              width: `${dropdownPosition.width}px`,

              zIndex: 9999,
            }}
          >
            {searchResults.length > 0 ? (
              <div className="max-h-80 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="p-2 space-y-1">
                  {searchResults.map((result, index) => (
                    <button
                      key={result.symbol}
                      ref={(el) => {
                        resultRefs.current[index] = el;
                      }}
                      onClick={() => handleAddItem(result.symbol, result.name)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between group ${
                        index === selectedIndex
                          ? 'bg-slate-100 dark:bg-slate-800'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-900 dark:text-white text-lg">
                            {result.symbol}
                          </span>

                          <span className="text-xs px-2 py-1 rounded bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 font-semibold">
                            {result.exchange}
                          </span>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
                          {result.name}
                        </p>
                      </div>

                      <span className="text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : !isSearching && searchInput.length > 0 ? (
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 text-center">
                <p className="text-slate-900 dark:text-white font-medium">
                  {t('portfolio.builder.search.no-results', { query: searchInput })}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {t('portfolio.builder.search.try-different')}
                </p>
              </div>
            ) : null}
          </div>,

          document.body
        )}

      {/* Today Warning Dialog */}
      <ConfirmDialog
        isOpen={showTodayWarning}
        onClose={() => setShowTodayWarning(false)}
        onConfirm={handleConfirmTodayWarning}
        title={t('portfolio.builder.today-warning.title')}
        message={t('portfolio.builder.today-warning.message')}
        confirmText={t('portfolio.builder.today-warning.confirm')}
        cancelText={t('common.button.cancel')}
        variant="warning"
      />

      {/* Auth Required Dialog */}
      {showAuthDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 border border-cyan-500/20 bg-cyan-500/5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-cyan-100 dark:bg-cyan-900/30">
                <Rocket className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {t('auth.required.title')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('auth.required.message')}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="/login"
                className="w-full px-4 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white transition-colors font-medium shadow-lg text-center"
              >
                {t('nav.signin')}
              </a>
              <a
                href="/signup"
                className="w-full px-4 py-3 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-900 dark:text-white transition-colors font-medium text-center"
              >
                {t('nav.signup')}
              </a>
              <button
                onClick={() => setShowAuthDialog(false)}
                className="w-full px-4 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors font-medium"
              >
                {t('common.button.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function PortfolioBuilder() {
  return (
    <ErrorBoundary fallback={<BuilderErrorFallback />}>
      <PortfolioBuilderContent />
    </ErrorBoundary>
  );
}
