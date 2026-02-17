'use client';

import { useTranslation } from 'react-i18next';
import { TrendingUp, Rocket, AlertCircle, Lightbulb } from 'lucide-react';
import dynamic from 'next/dynamic';
import { AnalysisSettings } from './AnalysisSettings';
import type { PortfolioItem } from '@glassbox/types';

const PortfolioDonutChart = dynamic(
  () => import('./PortfolioDonutChart').then((mod) => mod.PortfolioDonutChart),
  {
    loading: () => (
      <div className="w-full h-[250px] flex items-center justify-center">
        <div className="w-48 h-48 rounded-full border-[16px] border-black/5 dark:border-white/5 animate-pulse" />
      </div>
    ),
    ssr: false,
  }
);

interface PortfolioSummaryPanelProps {
  items: PortfolioItem[];
  colors: string[];
  dateRange: { startDate: string; endDate: string };
  setDateRange: (range: { startDate: string; endDate: string }) => void;
  validationError: string | null;
  onAnalyze: () => void;
}

/**
 * Right sidebar summary panel (desktop only)
 * Shows donut chart, stats, settings, and analyze CTA
 */
export function PortfolioSummaryPanel({
  items,
  colors,
  dateRange,
  setDateRange,
  validationError,
  onAnalyze,
}: PortfolioSummaryPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:block lg:col-span-4 sticky top-24">
      <div className="glass-panel p-6 space-y-6">
        <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          {t('portfolio.builder.preview.title')}
        </h3>

        {/* Donut Chart */}
        <PortfolioDonutChart items={items} colors={colors} />

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
        <AnalysisSettings dateRange={dateRange} setDateRange={setDateRange} variant="desktop" />

        {/* Main CTA */}
        <button
          onClick={onAnalyze}
          disabled={items.length === 0 || !!validationError}
          className="w-full glass-button text-lg py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <Rocket className="w-5 h-5 group-hover:animate-bounce" />
          <span>{t('portfolio.builder.analyze.button')}</span>
        </button>

        {items.length === 0 && !validationError && (
          <p className="text-xs text-center text-black/50 dark:text-white/50 mt-2">
            {t('portfolio.builder.analyze.hint')}
          </p>
        )}

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
  );
}
