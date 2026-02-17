'use client';

import { useTranslation } from 'react-i18next';

/**
 * Portfolio builder page header
 * Shows step badge, title with gradient, and description
 */
export function PageHeader() {
  const { t } = useTranslation();

  return (
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
  );
}
