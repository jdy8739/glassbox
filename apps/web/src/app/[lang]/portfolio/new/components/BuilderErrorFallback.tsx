'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { AlertCircle, Rocket } from 'lucide-react';

export function BuilderErrorFallback() {
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
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <span>{t('common.button.back-home')}</span>
          </Link>
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
