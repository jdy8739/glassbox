'use client';

import { useTranslation } from 'react-i18next';
import { Lightbulb, Info } from 'lucide-react';
import { Tooltip } from '@/components/Tooltip';

interface AnalysisSettingsProps {
  dateRange: { startDate: string; endDate: string };
  setDateRange: (range: { startDate: string; endDate: string }) => void;
  variant?: 'mobile' | 'desktop';
}

export function AnalysisSettings({ dateRange, setDateRange, variant = 'desktop' }: AnalysisSettingsProps) {
  const { t } = useTranslation();
  const isMobile = variant === 'mobile';

  const content = (
    <div className={isMobile ? 'space-y-4' : 'space-y-2'}>
      <label className={`flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-xs'} font-semibold text-black dark:text-white`}>
        <Lightbulb className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} text-cyan-500`} />
        {t('portfolio.builder.analysis.settings.label')}
        <Tooltip content={t('portfolio.builder.analysis.settings.tooltip')} width={250}>
          <Info className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} text-black/40 dark:text-white/40 cursor-help`} />
        </Tooltip>
      </label>

      <div className={isMobile ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
        <div>
          <p className={`text-xs text-black/60 dark:text-white/60 ${isMobile ? 'mb-2' : 'mb-1'}`}>
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
          <p className={`text-xs text-black/60 dark:text-white/60 ${isMobile ? 'mb-2' : 'mb-1'}`}>
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
  );

  if (isMobile) {
    return (
      <div className="lg:hidden glass-card-gradient cyan-blue">
        {content}
      </div>
    );
  }

  return content;
}
