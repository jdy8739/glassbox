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
    <main className="min-h-screen p-6 pb-32">
      {/* Navigation */}
      <nav className="nature-panel mx-auto max-w-4xl mb-12 flex items-center justify-between px-6 py-4 relative z-50">
        <a href="/" className="text-2xl font-bold text-white hover:text-grass-400 transition">
          ← Back
        </a>
        <button
          onClick={handleAnalyze}
          disabled={items.length === 0}
          className="nature-button disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          📊 Analyze
        </button>
      </nav>

      <div className="mx-auto max-w-4xl space-y-10">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            <span className="text-sm font-medium text-white/80">Step 1 of 3: Build Portfolio</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-white">
              Build Your
              <br />
              <span className="bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Investment Portfolio
              </span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl">
              Add your favorite stocks and let our algorithms find the optimal allocation for your risk profile.
            </p>
          </div>
        </div>

        {/* Search Bar - Enhanced */}
        <div className="nature-card-gradient purple-blue">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-white">📍 Add Stock Ticker</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="e.g., AAPL, MSFT, NVDA, TSLA, GOOG..."
                className="nature-input flex-1 text-lg"
              />
              <button
                onClick={() => addItem(searchInput)}
                className="nature-button whitespace-nowrap"
              >
                Add Stock
              </button>
            </div>
            <p className="text-xs text-white/50">
              💡 Pro tip: Add 5-15 stocks for best results
            </p>
          </div>
        </div>

        {/* Quick Add Presets */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-white">✨ Popular Assets</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { name: 'Treasury Bonds', ticker: 'TLT', icon: '🏦', color: 'gold' },
              { name: 'Bitcoin', ticker: 'BTC', icon: '₿', color: 'coral' },
              { name: 'Gold', ticker: 'GLD', icon: '💛', color: 'gold' },
              { name: 'S&P 500', ticker: 'SPY', icon: '📈', color: 'purple' },
              { name: 'Tech', ticker: 'QQQ', icon: '🔧', color: 'cyan' },
              { name: 'Energy', ticker: 'XLE', icon: '⚡', color: 'coral' },
            ].map((preset) => (
              <button
                key={preset.ticker}
                onClick={() => addItem(preset.ticker)}
                className={`nature-card-gradient ${preset.color === 'gold' ? 'gold-cyan' : preset.color === 'coral' ? 'coral-pink' : preset.color === 'cyan' ? 'indigo-green' : 'purple-blue'} p-4 text-center cursor-pointer transform transition-all hover:scale-105 group`}
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{preset.icon}</div>
                <p className="text-xs font-semibold text-white">{preset.name}</p>
                <p className="text-xs text-white/60">{preset.ticker}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Asset List - Enhanced */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-white">
              📋 Your Assets <span className="text-cyan-300">({items.length})</span>
            </label>
            {items.length > 0 && (
              <span className="text-xs px-3 py-1 rounded-full bg-grass-400/20 border border-grass-400/30 text-grass-300">
                Ready to analyze
              </span>
            )}
          </div>

          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="nature-panel p-12 text-center space-y-4">
                <div className="text-5xl">📍</div>
                <div>
                  <p className="text-lg text-white font-semibold mb-2">No assets added yet</p>
                  <p className="text-white/60">Search for a ticker or use the preset buttons above to get started</p>
                </div>
              </div>
            ) : (
              <>
                {items.map((item, index) => (
                  <div
                    key={item.symbol}
                    className="nature-card group hover:border-cyan-300/50 transition-all"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-300 to-cyan-300 flex items-center justify-center text-lg font-bold text-white">
                          {item.symbol[0]}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-white text-lg">{item.symbol}</p>
                          <p className="text-xs text-white/50">Stock #{index + 1}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-2">
                          <label className="text-sm text-white/70 whitespace-nowrap">Qty:</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.symbol, parseFloat(e.target.value) || 0)
                            }
                            min="0"
                            step="0.01"
                            className="nature-input w-24 bg-white/10"
                          />
                        </div>
                        <button
                          onClick={() => removeItem(item.symbol)}
                          className="w-10 h-10 rounded-lg bg-red-400/10 border border-red-400/20 text-red-300 hover:bg-red-400/20 transition-all flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        {items.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <p className="text-white/70">Portfolio completeness</p>
              <p className="text-grass-400 font-semibold">{Math.min(items.length * 20, 100)}%</p>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-grass-400 to-cyan-300 transition-all duration-300"
                style={{ width: `${Math.min(items.length * 20, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {items.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center">
          <button
            onClick={handleAnalyze}
            className="nature-button text-lg font-semibold px-12 py-4 shadow-2xl hover:scale-105 transition-transform max-w-md"
          >
            <span>🚀</span>
            <span>Analyze Portfolio</span>
          </button>
        </div>
      )}
    </main>
  );
}
