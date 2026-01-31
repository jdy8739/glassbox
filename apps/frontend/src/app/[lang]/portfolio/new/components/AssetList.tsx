'use client';

import { useTranslation } from 'react-i18next';
import { X, Plus, Minus } from 'lucide-react';

interface PortfolioItem {
  symbol: string;
  quantity: number;
}

interface AssetListProps {
  items: PortfolioItem[];
  colors: string[];
  onRemove: (symbol: string) => void;
  onUpdateQuantity: (symbol: string, quantity: number) => void;
}

export function AssetList({ items, colors, onRemove, onUpdateQuantity }: AssetListProps) {
  const { t } = useTranslation();
  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const color = colors[index % colors.length];
        
        return (
          <div
            key={item.symbol}
            className="group relative overflow-hidden rounded-2xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
          >
            {/* Dynamic Gradient Background */}
            <div 
              className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
              style={{ background: `linear-gradient(135deg, ${color} 0%, transparent 100%)` }}
            />

            <div className="relative p-4 flex items-center gap-5">
              {/* Symbol Circle with Glow */}
              <div className="relative">
                <div 
                  className="absolute inset-0 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity"
                  style={{ backgroundColor: color }}
                />
                <div 
                  className="relative w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-inner"
                  style={{ 
                    backgroundColor: color,
                    backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)'
                  }}
                >
                  {item.symbol[0]}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-black dark:text-white text-lg leading-tight tracking-tight">
                  {item.symbol}
                </h3>
                <p className="text-xs font-medium text-black/50 dark:text-white/50 mt-0.5 truncate">
                  {t('portfolio.asset.label')} #{index + 1}
                </p>
              </div>

              {/* Quantity Controls - Glass Style */}
              <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded-xl p-1 border border-black/5 dark:border-white/5">
                <button 
                  onClick={() => onUpdateQuantity(item.symbol, Math.max(0, item.quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-white/10 text-black dark:text-white transition-all active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                
                <div className="w-16 text-center flex">
                   <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => onUpdateQuantity(item.symbol, parseFloat(e.target.value) || 0)}
                    className="w-full text-center bg-transparent font-bold text-sm text-black dark:text-white focus:outline-none p-0"
                    min="0"
                  />
                  <span className="text-[9px] flex items-center text-black/40 dark:text-white/40 uppercase tracking-wider font-semibold -mt-0.5">{t('portfolio.asset.units')}</span>
                </div>

                <button 
                  onClick={() => onUpdateQuantity(item.symbol, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-white/10 text-black dark:text-white transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => onRemove(item.symbol)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-black/40 dark:text-white/40 hover:bg-red-500/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 hover:scale-105"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}