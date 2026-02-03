'use client';

import { Zap, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LandingErrorFallback() {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen px-6 py-8 flex items-center justify-center">
      <div className="glass-panel p-8 max-w-md w-full text-center space-y-6 border-orange-500/20 bg-orange-500/5">
        <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-black dark:text-white mb-2">
            {t('landing.error.title')}
          </h2>
          <p className="text-sm text-black/60 dark:text-white/60">
            {t('landing.error.message')}
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm font-medium shadow-lg shadow-orange-500/20"
          >
            <Zap className="w-4 h-4" />
            {t('landing.error.reload')}
          </button>
        </div>
      </div>
    </main>
  );
}
