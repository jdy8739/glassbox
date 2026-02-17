'use client';

import { useTranslation } from 'react-i18next';
import { Rocket } from 'lucide-react';

interface MobileBottomBarProps {
  itemCount: number;
  validationError: string | null;
  onAnalyze: () => void;
}

export function MobileBottomBar({ itemCount, validationError, onAnalyze }: MobileBottomBarProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-white/20 z-50 lg:hidden">
      <div className="flex items-center gap-4 max-w-lg mx-auto">
        <div className="flex-1">
          <p className="text-xs text-black/50 dark:text-white/50 font-medium">
            {t('portfolio.builder.summary.label')}
          </p>

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-black dark:text-white">
              {itemCount} {t('portfolio.builder.summary.assets')}
            </span>

            <span className="text-sm text-black/60 dark:text-white/60">~ 00k</span>
          </div>
        </div>

        <button
          onClick={onAnalyze}
          disabled={itemCount === 0 || !!validationError}
          className="glass-button px-6 py-3 flex items-center gap-2 disabled:opacity-50"
        >
          <Rocket className="w-4 h-4" />
          <span>{t('nav.analyze')}</span>
        </button>
      </div>
    </div>
  );
}
