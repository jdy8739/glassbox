'use client';

import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Sparkles, Layers, AlertCircle, Check } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { usePortfolioBuilder } from './usePortfolioBuilder';
import { useDialogs } from './hooks/useDialogs';
import { AssetList } from './components/AssetList';
import { StarterTemplates } from './components/StarterTemplates';
import { QuickAddAssets } from './components/QuickAddAssets';
import { BuilderErrorFallback } from './components/BuilderErrorFallback';
import { AnalysisSettings } from './components/AnalysisSettings';
import { MobileBottomBar } from './components/MobileBottomBar';
import { PageHeader } from './components/PageHeader';
import { SearchWithDropdown } from './components/SearchWithDropdown';
import { PortfolioSummaryPanel } from './components/PortfolioSummaryPanel';
import { AuthRequiredDialog } from './components/AuthRequiredDialog';
import { HeaderPortal } from '@/lib/header-context';
import { ErrorBoundary } from '@/components/error-boundary';
import { BackButton } from '@/components/back-button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useLocalizedRouter } from '@/hooks/useLocalizedRouter';
import { validatePortfolioAnalysis, isEndDateToday } from '@/lib/portfolio-validation';

const CHART_COLORS = [
  '#06b6d4', // Cyan 500
  '#f472b6', // Pink 400
  '#a78bfa', // Violet 400
  '#fbbf24', // Amber 400
  '#34d399', // Emerald 400
  '#60a5fa', // Blue 400
];

function PortfolioBuilderContent() {
  const { t } = useTranslation();
  const router = useLocalizedRouter();
  const pathname = usePathname();
  const { status } = useSession();

  // Portfolio builder hook (CRUD)
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

  // Dialog state management
  const {
    showTodayWarning,
    setShowTodayWarning,
    showAuthDialog,
    setShowAuthDialog,
    showClearConfirm,
    setShowClearConfirm,
  } = useDialogs();

  // Toast state
  const [addedTicker, setAddedTicker] = useState<string | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (addedTicker) {
      const timer = setTimeout(() => setAddedTicker(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [addedTicker]);

  // Computed state
  const isAuthenticated = status === 'authenticated';
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

  // Analyze handler
  const handleAnalyze = () => {
    if (items.length === 0) return;
    if (validationError) return;

    if (!isAuthenticated) {
      saveDraft();
      setShowAuthDialog(true);
      return;
    }

    if (isEndDateToday(dateRange)) {
      setShowTodayWarning(true);
      return;
    }

    navigateToResults();
  };

  // Confirm today warning handler
  const handleConfirmTodayWarning = () => {
    setShowTodayWarning(false);
    navigateToResults();
  };

  // Add item handler
  const handleAddItem = (symbol: string, name?: string) => {
    addItem(symbol);
    setAddedTicker(symbol);
  };

  return (
    <main className="min-h-screen px-6 pt-8 pb-32">
      <HeaderPortal nav={<BackButton href="/" />} />

      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Workbench (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Header */}
            <PageHeader />

            {/* Search Bar with Dropdown */}
            <SearchWithDropdown
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              searchResults={searchResults}
              isSearching={isSearching}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              onAddItem={handleAddItem}
            />

            {/* Quick Add Assets */}
            <QuickAddAssets onAdd={handleAddItem} />

            {/* Mobile Analysis Settings */}
            <AnalysisSettings dateRange={dateRange} setDateRange={setDateRange} variant="mobile" />

            {/* Main Content: Empty State or Asset List */}
            <div className="space-y-6">
              {items.length === 0 ? (
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
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-black dark:text-white flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      {t('portfolio.builder.assets.label')}
                    </label>
                    <button
                      onClick={() => setShowClearConfirm(true)}
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
          <PortfolioSummaryPanel
            items={items}
            colors={CHART_COLORS}
            dateRange={dateRange}
            setDateRange={setDateRange}
            validationError={validationError}
            onAnalyze={handleAnalyze}
          />
        </div>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <MobileBottomBar
        itemCount={items.length}
        validationError={validationError}
        onAnalyze={handleAnalyze}
      />

      {/* Mobile validation error */}
      {validationError && (
        <div className="fixed bottom-24 left-0 right-0 px-4 z-40 lg:hidden">
          <div className="max-w-lg mx-auto px-4 py-3 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-800/30 backdrop-blur-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 flex-shrink-0" />
            <p className="text-sm text-rose-700 dark:text-rose-300">{validationError}</p>
          </div>
        </div>
      )}

      {/* Ticker added toast (mobile only) */}
      {addedTicker && (
        <div className="fixed top-20 right-6 z-50 glass-panel px-6 py-4 border-cyan-400/30 bg-cyan-500/10 animate-fade-in shadow-xl lg:hidden">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <p className="font-bold text-black dark:text-white">
              {addedTicker} {t('portfolio.builder.toast.added')}
            </p>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          loadTemplate([]);
          setShowClearConfirm(false);
        }}
        title={t('portfolio.builder.clear.title')}
        message={t('portfolio.builder.clear.message')}
        confirmText={t('portfolio.builder.clear.confirm')}
        cancelText={t('common.button.cancel')}
        variant="danger"
      />

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

      <AuthRequiredDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        pathname={pathname}
      />
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
