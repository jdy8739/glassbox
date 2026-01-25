'use client';

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
  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const color = colors[index % colors.length];
        
        return (
          <div
            key={item.symbol}
            className="glass-card p-4 flex items-center gap-4 group hover:border-cyan-500/30 transition-all"
            style={{ borderLeft: `4px solid ${color}` }}
          >
            {/* Symbol Circle */}
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold text-white shadow-md"
              style={{ backgroundColor: color }}
            >
              {item.symbol[0]}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="font-bold text-black dark:text-white text-lg leading-none">
                {item.symbol}
              </h3>
              <p className="text-xs text-black/50 dark:text-white/50 mt-1">Asset #{index + 1}</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 rounded-lg p-1">
              <button 
                onClick={() => onUpdateQuantity(item.symbol, Math.max(0, item.quantity - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => onUpdateQuantity(item.symbol, parseFloat(e.target.value) || 0)}
                className="w-16 text-center bg-transparent font-semibold text-black dark:text-white focus:outline-none"
                min="0"
              />

              <button 
                onClick={() => onUpdateQuantity(item.symbol, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => onRemove(item.symbol)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-400/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
