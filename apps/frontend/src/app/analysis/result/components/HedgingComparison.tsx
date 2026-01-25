'use client';

import { TrendingUp, Shield } from 'lucide-react';

interface HedgingProps {
  spy: {
    shares: number;
    notional: number;
  };
  es: {
    contracts: number;
    notional: number;
  };
  beta: number;
}

export function HedgingComparison({ data }: { data: HedgingProps }) {
  // Determine recommendation based on portfolio size/efficiency (simple logic: > $100k implies ES is efficient)
  // Since we assume $100k, we'll mark SPY as "Retail Friendly" and ES as "Capital Efficient"
  
  if (!data?.spy || !data?.es) return null;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* SPY Strategy */}
      <div className="glass-panel p-6 relative overflow-hidden group hover:border-cyan-400/30 transition-all">
        <div className="absolute top-0 right-0 bg-cyan-500/10 px-3 py-1 rounded-bl-xl border-b border-l border-cyan-500/20">
          <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">Retail Friendly</span>
        </div>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-black dark:text-white">SPY ETF</h3>
            <p className="text-xs text-black/50 dark:text-white/50">Direct Equity Hedge</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-black/5 dark:border-white/5 pb-3">
            <span className="text-sm text-black/60 dark:text-white/60">Short Position</span>
            <span className="text-xl font-bold text-black dark:text-white">{Math.abs(data.spy.shares)} <span className="text-sm font-normal text-black/40 dark:text-white/40">shares</span></span>
          </div>
          <div className="flex justify-between items-end border-b border-black/5 dark:border-white/5 pb-3">
            <span className="text-sm text-black/60 dark:text-white/60">Notional Value</span>
            <span className="text-xl font-bold text-black dark:text-white">${Math.abs(data.spy.notional).toLocaleString()}</span>
          </div>
          <div className="pt-2">
            <p className="text-xs text-black/50 dark:text-white/50 leading-relaxed">
              <strong>Why choose this?</strong> Best for accounts under $100k. No expiration dates to manage, simply short the ETF to neutralize delta.
            </p>
          </div>
        </div>
      </div>

      {/* ES Strategy */}
      <div className="glass-panel p-6 relative overflow-hidden group hover:border-purple-400/30 transition-all">
        <div className="absolute top-0 right-0 bg-purple-500/10 px-3 py-1 rounded-bl-xl border-b border-l border-purple-500/20">
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Capital Efficient</span>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-black dark:text-white">ES Futures</h3>
            <p className="text-xs text-black/50 dark:text-white/50">E-mini S&P 500</p>
          </div>
        </div>

        <div className="space-y-4">
           <div className="flex justify-between items-end border-b border-black/5 dark:border-white/5 pb-3">
            <span className="text-sm text-black/60 dark:text-white/60">Short Contracts</span>
            <span className="text-xl font-bold text-black dark:text-white">{Math.abs(data.es.contracts)} <span className="text-sm font-normal text-black/40 dark:text-white/40">contracts</span></span>
          </div>
          <div className="flex justify-between items-end border-b border-black/5 dark:border-white/5 pb-3">
            <span className="text-sm text-black/60 dark:text-white/60">Notional Value</span>
            <span className="text-xl font-bold text-black dark:text-white">${Math.abs(data.es.notional).toLocaleString()}</span>
          </div>
          <div className="pt-2">
            <p className="text-xs text-black/50 dark:text-white/50 leading-relaxed">
              <strong>Why choose this?</strong> Requires significantly less buying power (margin). Ideal for larger portfolios to free up capital.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
