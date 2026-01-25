'use client';

import { Building2, Bitcoin, DollarSign, BarChart3, Wrench, Zap, Sparkles } from 'lucide-react';

interface QuickAddAssetsProps {
  onAdd: (symbol: string) => void;
}

export function QuickAddAssets({ onAdd }: QuickAddAssetsProps) {
  const assets = [
    { name: 'Treasury Bonds', ticker: 'TLT', icon: Building2, color: 'slate' },
    { name: 'Bitcoin', ticker: 'BTC', icon: Bitcoin, color: 'coral' },
    { name: 'Gold', ticker: 'GLD', icon: DollarSign, color: 'amber' },
    { name: 'S&P 500', ticker: 'SPY', icon: BarChart3, color: 'cyan' },
    { name: 'Tech', ticker: 'QQQ', icon: Wrench, color: 'cyan' },
    { name: 'Energy', ticker: 'XLE', icon: Zap, color: 'coral' },
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-black dark:text-white flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        Popular Assets
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {assets.map((asset) => {
          const IconComponent = asset.icon;
          let colorClass = '';
          
          if (asset.color === 'slate') colorClass = 'slate-glow';
          else if (asset.color === 'coral') colorClass = 'coral-pink';
          else if (asset.color === 'cyan') colorClass = 'cyan-blue';
          else if (asset.color === 'amber') colorClass = 'glass-card bg-amber-500/10 border-amber-500/50'; // Custom for Gold
          else colorClass = 'glass-card';

          return (
            <button
              key={asset.ticker}
              onClick={() => onAdd(asset.ticker)}
              className={`${colorClass} p-3 text-center cursor-pointer transform transition-all hover:scale-105 group rounded-xl border flex flex-col items-center justify-center gap-2 h-28`}
            >
              <div className="group-hover:scale-110 transition-transform">
                <IconComponent className={`w-6 h-6 ${asset.ticker === 'GLD' ? 'text-amber-400' : 'text-cyan-400'}`} />
              </div>
              <div>
                <p className="text-xs font-bold text-black dark:text-white">{asset.name}</p>
                <p className="text-[10px] text-black/60 dark:text-white/60 font-mono mt-0.5">{asset.ticker}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
