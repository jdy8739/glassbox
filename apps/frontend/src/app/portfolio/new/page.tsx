'use client';

import { useState } from 'react';
import type { PortfolioItem } from '@glassbox/types';

export default function PortfolioBuilder() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [searchInput, setSearchInput] = useState('');

  const addItem = (symbol: string) => {
    if (symbol && !items.find((item) => item.symbol === symbol.toUpperCase())) {
      setItems([...items, { symbol: symbol.toUpperCase(), quantity: 1 }]);
      setSearchInput('');
    }
  };

  const removeItem = (symbol: string) => {
    setItems(items.filter((item) => item.symbol !== symbol));
  };

  const updateQuantity = (symbol: string, quantity: number) => {
    setItems(
      items.map((item) => (item.symbol === symbol ? { ...item, quantity } : item)),
    );
  };

  const handleAnalyze = async () => {
    console.log('Analyzing portfolio:', items);
    // TODO: Send to backend API
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="glass-panel space-y-4 p-6">
          <h1 className="text-3xl font-bold text-white">Portfolio Builder</h1>
          <p className="text-white/70">Add stocks to build your portfolio</p>
        </div>

        {/* Search Bar */}
        <div className="glass-panel p-6">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-white">Search Ticker</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="e.g., AAPL, MSFT, NVDA"
                className="glass-input flex-1"
              />
              <button
                onClick={() => addItem(searchInput)}
                className="glass-button font-semibold text-white"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Quick Add Chips */}
        <div className="glass-panel p-6">
          <label className="mb-3 block text-sm font-semibold text-white">
            Quick Add Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Safe', ticker: 'TLT' },
              { name: 'Bitcoin', ticker: 'BTC' },
              { name: 'Gold', ticker: 'GLD' },
            ].map((preset) => (
              <button
                key={preset.ticker}
                onClick={() => addItem(preset.ticker)}
                className="glass-button text-white"
              >
                #{preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Asset List */}
        <div className="glass-panel p-6">
          <label className="mb-4 block text-sm font-semibold text-white">
            Your Assets ({items.length})
          </label>
          <div className="space-y-2">
            {items.length === 0 ? (
              <p className="text-center text-white/50">No assets added yet</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.symbol}
                  className="flex items-center justify-between rounded-lg bg-white/5 p-4"
                >
                  <div className="flex flex-1 items-center gap-4">
                    <span className="font-semibold text-white">{item.symbol}</span>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-white/70">Qty:</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.symbol, parseFloat(e.target.value) || 0)
                        }
                        min="0"
                        step="0.01"
                        className="glass-input w-20"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.symbol)}
                    className="text-white/70 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Button */}
        {items.length > 0 && (
          <div className="sticky bottom-6 flex justify-center">
            <button
              onClick={handleAnalyze}
              className="glass-panel px-8 py-4 text-lg font-bold text-white hover:shadow-glass-lg"
            >
              Analyze Portfolio
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
