'use client';

import { useTranslation } from 'react-i18next';
import { Activity, TrendingUp, Zap, Target } from 'lucide-react';

interface MetricProps {
  label: string;
  value: string;
  subValue: string;
  icon: any;
  trend?: 'up' | 'down' | 'neutral';
  color: 'cyan' | 'purple' | 'pink' | 'emerald';
}

function MetricCard({ label, value, subValue, icon: Icon, color }: MetricProps) {
  const colorStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  };

  return (
    <div className="glass-panel p-5 flex items-start justify-between group hover:scale-[1.02] transition-transform">
      <div>
        <p className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-bold text-black dark:text-white mb-1">{value}</p>
        <p className="text-xs font-medium opacity-70 flex items-center gap-1">
          {subValue}
        </p>
      </div>
      <div className={`p-3 rounded-xl border ${colorStyles[color]} transition-colors group-hover:bg-opacity-20`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}

interface PortfolioStats {
  maxSharpe: {
    return: number;
    volatility: number;
    sharpe: number;
  };
  gmv: {
    volatility: number;
  };
  beta: number;
}

export function KeyMetrics({ stats }: { stats: PortfolioStats }) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label={t('analysis.metrics.return')}
        value={`${(stats.maxSharpe.return * 100).toFixed(1)}%`}
        subValue={t('analysis.metrics.return-sub')}
        icon={TrendingUp}
        color="emerald"
      />
      <MetricCard
        label={t('analysis.metrics.sharpe')}
        value={stats.maxSharpe.sharpe.toFixed(2)}
        subValue={t('analysis.metrics.sharpe-sub')}
        icon={Zap}
        color="purple"
      />
      <MetricCard
        label={t('analysis.metrics.volatility')}
        value={`${(stats.maxSharpe.volatility * 100).toFixed(1)}%`}
        subValue={`${t('analysis.metrics.volatility-sub')}: ${(stats.gmv.volatility * 100).toFixed(1)}%`}
        icon={Activity}
        color="pink"
      />
      <MetricCard
        label={t('analysis.metrics.beta')}
        value={stats.beta.toFixed(2)}
        subValue={t('analysis.metrics.beta-sub')}
        icon={Target}
        color="cyan"
      />
    </div>
  );
}
