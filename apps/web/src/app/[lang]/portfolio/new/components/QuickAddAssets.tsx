'use client';

import { useTranslation } from 'react-i18next';
import { Building2, Bitcoin, DollarSign, BarChart3, Wrench, Zap, Sparkles } from 'lucide-react';

interface QuickAddAssetsProps {
  onAdd: (symbol: string) => void;
}

export function QuickAddAssets({ onAdd }: QuickAddAssetsProps) {
  const { t } = useTranslation();

  const assets = [
    { nameKey: 'portfolio.quick-add.treasury-bonds', ticker: 'TLT', icon: Building2, color: 'slate' },
    { nameKey: 'portfolio.quick-add.bitcoin', ticker: 'BTC', icon: Bitcoin, color: 'coral' },
    { nameKey: 'portfolio.quick-add.gold', ticker: 'GLD', icon: DollarSign, color: 'amber' },
    { nameKey: 'portfolio.quick-add.sp500', ticker: 'SPY', icon: BarChart3, color: 'cyan' },
    { nameKey: 'portfolio.quick-add.tech', ticker: 'QQQ', icon: Wrench, color: 'cyan' },
    { nameKey: 'portfolio.quick-add.energy', ticker: 'XLE', icon: Zap, color: 'coral' },
  ];

  const getColorConfig = (color: string) => {
    const colorMap: Record<string, { bg: string; border: string; icon: string; gradient: string }> = {
      slate: { bg: 'bg-gradient-to-br from-slate-600/20 to-slate-700/10', border: 'border-slate-400/40', icon: 'text-slate-400', gradient: 'from-slate-500 to-slate-600' },
      coral: { bg: 'bg-gradient-to-br from-coral-500/15 to-coral-600/5', border: 'border-coral-400/40', icon: 'text-coral-400', gradient: 'from-coral-500 to-coral-600' },
      cyan: { bg: 'bg-gradient-to-br from-cyan-500/15 to-cyan-600/5', border: 'border-cyan-400/40', icon: 'text-cyan-400', gradient: 'from-cyan-500 to-cyan-600' },
      amber: { bg: 'bg-gradient-to-br from-amber-500/15 to-amber-600/5', border: 'border-amber-400/40', icon: 'text-amber-400', gradient: 'from-amber-500 to-amber-600' },
    };
    return colorMap[color] || colorMap.cyan;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <label className="text-sm font-bold text-black dark:text-white">
            {t('portfolio.quick-add.title')}
          </label>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {assets.map((asset) => {
          const IconComponent = asset.icon;
          const colorConfig = getColorConfig(asset.color);

          return (
            <button
              key={asset.ticker}
              onClick={() => onAdd(asset.ticker)}
              className={`group relative overflow-hidden rounded-2xl ${colorConfig.bg} border ${colorConfig.border} backdrop-blur-md p-4 text-center cursor-pointer transform transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95 flex flex-col items-center justify-center gap-3 h-32`}
            >
              {/* Gradient Overlay on Hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, var(--color-start) 0%, var(--color-end) 100%)`
                }}
              />

              {/* Icon Container with Glow */}
              <div className="relative z-10">
                <div
                  className={`absolute inset-0 w-10 h-10 rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300`}
                  style={{ backgroundColor: colorConfig.icon.split('-')[1] }}
                />
                <div className="relative bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-xl p-2.5 group-hover:scale-125 transition-transform duration-300">
                  <IconComponent className={`w-6 h-6 ${colorConfig.icon}`} />
                </div>
              </div>

              {/* Text Content */}
              <div className="relative z-10 min-w-0">
                <p className="text-xs font-bold text-black dark:text-white leading-tight">
                  {t(asset.nameKey)}
                </p>
                <p className="text-[11px] text-black/60 dark:text-white/70 font-mono font-semibold mt-1 tracking-wider">
                  {asset.ticker}
                </p>
              </div>

              {/* Animated Border */}
              <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/20 transition-all duration-300 pointer-events-none" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
