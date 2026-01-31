'use client';

import { useTranslation } from 'react-i18next';
import { LocalizedLink } from '@/components/LocalizedLink';
import { Trash2, TrendingUp, Activity, Calendar } from 'lucide-react';
import type { Portfolio } from '@glassbox/types';
import { formatShortDate } from '@/lib/utils/date';

interface PortfolioCardProps {
  portfolio: Portfolio;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  colors: string[];
}

export function PortfolioCard({ portfolio, onDelete, isDeleting, colors }: PortfolioCardProps) {
  const { t } = useTranslation();
  const stats = portfolio.analysisSnapshot?.maxSharpe?.stats;

  // Calculate composition based on quantities (simple visual approximation)
  const totalQuantity = portfolio.quantities.reduce((a, b) => a + b, 0);
  const composition = portfolio.tickers.map((ticker, index) => ({
    ticker,
    percentage: (portfolio.quantities[index] / totalQuantity) * 100,
    color: colors[index % colors.length]
  }));

  return (
    <div className="glass-panel p-5 group hover:border-cyan-500/30 transition-all flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-black dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
            {portfolio.name}
          </h3>
          <p className="text-xs text-black/50 dark:text-white/50 flex items-center gap-1 mt-1">
            <Calendar className="w-3 h-3" />
            {formatShortDate(portfolio.updatedAt)}
            {portfolio.analysisSnapshot?.analysisDate && (
              <span className="ml-1 opacity-70">
                ({t('portfolio.card.start-date')}: {portfolio.analysisSnapshot.analysisDate})
              </span>
            )}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(portfolio.id);
          }}
          disabled={isDeleting}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-black/20 dark:text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all"
        >
          {isDeleting ? (
            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Composition Bar */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between text-xs text-black/60 dark:text-white/60 mb-1">
          <span>{t('portfolio.card.composition')}</span>
          <span>{portfolio.tickers.length} {t('portfolio.card.assets')}</span>
        </div>
        <div className="h-2 w-full flex rounded-full overflow-hidden bg-black/5 dark:bg-white/5">
          {composition.map((item) => (
            <div
              key={item.ticker}
              style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
              className="h-full"
              title={`${item.ticker}: ${item.percentage.toFixed(1)}%`}
            />
          ))}
        </div>
        <div className="flex gap-2 overflow-hidden">
          {portfolio.tickers.slice(0, 4).map((ticker, i) => (
            <span key={ticker} className="text-[10px] font-mono text-black/40 dark:text-white/40">
              {ticker}
            </span>
          ))}
          {portfolio.tickers.length > 4 && (
            <span className="text-[10px] text-black/40 dark:text-white/40">...</span>
          )}
        </div>
      </div>

      {/* Quick Stats (if available) */}
      {stats && (
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="bg-black/5 dark:bg-white/5 rounded-lg p-2 text-center">
            <p className="text-[10px] text-black/50 dark:text-white/50 uppercase tracking-wider mb-0.5">{t('portfolio.card.sharpe')}</p>
            <div className="flex items-center justify-center gap-1 text-black dark:text-white font-bold">
              <TrendingUp className="w-3 h-3 text-cyan-500" />
              {stats.sharpe.toFixed(2)}
            </div>
          </div>
          <div className="bg-black/5 dark:bg-white/5 rounded-lg p-2 text-center">
            <p className="text-[10px] text-black/50 dark:text-white/50 uppercase tracking-wider mb-0.5">{t('portfolio.card.volatility')}</p>
            <div className="flex items-center justify-center gap-1 text-black dark:text-white font-bold">
              <Activity className="w-3 h-3 text-pink-500" />
              {(stats.volatility * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      <div className="mt-auto">
        <LocalizedLink
          href={`/analysis/result?portfolioId=${portfolio.id}`}
          className="block w-full text-center py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          {t('portfolio.card.open-analysis')}
        </LocalizedLink>
      </div>
    </div>
  );
}
