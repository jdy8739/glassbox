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
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-grass-50 to-sky-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="nature-panel space-y-2 p-6">
          <h1 className="text-3xl font-bold text-grass-700">Portfolio Builder</h1>
          <p className="text-rain-600">Add stocks to build your portfolio</p>
        </div>

        {/* Search Bar */}
        <div className="nature-panel p-6">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-grass-700">Search Ticker</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="e.g., AAPL, MSFT, NVDA"
                className="nature-input flex-1"
              />
              <button
                onClick={() => addItem(searchInput)}
                className="nature-button whitespace-nowrap text-sm"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Quick Add Chips */}
        <div className="nature-panel p-6">
          <label className="mb-4 block text-sm font-semibold text-grass-700">
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
                className="nature-badge cursor-pointer transition-all hover:bg-grass-200 hover:shadow-md"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Asset List */}
        <div className="nature-panel p-6">
          <label className="mb-4 block text-sm font-semibold text-grass-700">
            Your Assets ({items.length})
          </label>
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="flex h-20 items-center justify-center rounded-lg bg-sky-50">
                <p className="text-center text-rain-400">No assets added yet</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.symbol}
                  className="flex items-center justify-between rounded-lg border border-rain-100 bg-sky-50/50 p-4 transition-all hover:bg-sky-100/50"
                >
                  <div className="flex flex-1 items-center gap-4">
                    <span className="font-semibold text-grass-700">{item.symbol}</span>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-rain-600">Qty:</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.symbol, parseFloat(e.target.value) || 0)
                        }
                        min="0"
                        step="0.01"
                        className="nature-input w-20"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.symbol)}
                    className="ml-4 text-rain-400 transition-colors hover:text-red-500"
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
              className="nature-button text-lg font-semibold shadow-xl"
            >
              Analyze Portfolio
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
