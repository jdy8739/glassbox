'use client';

import { Sparkles, TrendingUp, Lightbulb, Plus, X as XIcon, Building2, Bitcoin, DollarSign, BarChart3, Wrench, Zap, Clipboard, MapPin, Rocket } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePortfolioBuilder } from './usePortfolioBuilder';

export default function PortfolioBuilder() {
  const {
    items,
    searchInput,
    setSearchInput,
    searchResults,
    isSearching,
    isAnalyzing,
    analysisError,
    showDropdown,
    setShowDropdown,
    addItem,
    removeItem,
    updateQuantity,
    handleAnalyze,
    clearError,
  } = usePortfolioBuilder();

  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const searchRef = useRef<HTMLDivElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-show dropdown when results arrive or input changes
  useEffect(() => {
    if (searchResults.length > 0 && searchInput.length >= 1) {
      setShowDropdown(true);
    } else if (searchInput.length < 1) {
      setShowDropdown(false);
    }
  }, [searchResults, searchInput, setShowDropdown]);

  // Update dropdown position
  useEffect(() => {
    const updatePosition = () => {
      if (inputWrapperRef.current) {
        const rect = inputWrapperRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 8, // 8px gap
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    };

    if (showDropdown) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }

    return undefined;
  }, [showDropdown]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowDropdown]);

  const handleAddItem = (symbol: string, name?: string) => {
    if (addItem(symbol, name)) {
      // Smooth scroll to bottom after item is added
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  return (
    <main className="min-h-screen px-6 pt-8 pb-32">
      {/* Navigation */}
      <nav className="glass-panel mx-auto max-w-6xl mb-8 flex items-center justify-between px-6 py-3 relative z-40 rounded-xl">
        <a href="/" className="text-sm font-semibold text-black dark:text-white/80 hover:text-black dark:text-white transition-colors duration-200 flex items-center gap-2">
          <span>←</span>
          <span>Back</span>
        </a>
        <button
          onClick={handleAnalyze}
          disabled={items.length === 0 || isAnalyzing}
          className="glass-button disabled:opacity-50 disabled:cursor-not-allowed text-xs px-4 py-2 flex items-center gap-1.5"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <TrendingUp className="w-5 h-5" />
              <span>Analyze</span>
            </>
          )}
        </button>
      </nav>

      <div className="mx-auto max-w-6xl space-y-10">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            <span className="text-sm font-medium text-black dark:text-white/80">Step 1 of 3: Build Portfolio</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-black dark:text-white">
              Build Your
              <br />
              <span className="bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Investment Portfolio
              </span>
            </h1>
            <p className="text-xl text-black dark:text-white/70 max-w-2xl">
              Add your favorite stocks and let our algorithms find the optimal allocation for your risk profile.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {analysisError && (
          <div className="glass-card-gradient coral-pink">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h4 className="font-semibold text-black dark:text-white mb-1">Analysis Failed</h4>
                <p className="text-sm text-black/70 dark:text-white/70">{analysisError}</p>
                <button
                  onClick={clearError}
                  className="mt-3 text-xs px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar - Enhanced with Autocomplete */}
        <div className="glass-card-gradient cyan-blue overflow-visible">
          <div className="space-y-4 overflow-visible">
            <label className="block text-sm font-semibold text-black dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Add Stock Ticker
            </label>
            <div className="relative overflow-visible" ref={searchRef}>
              <div className="flex gap-3" ref={inputWrapperRef}>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onFocus={() => {
                      if (searchResults.length > 0) setShowDropdown(true);
                    }}
                    placeholder="Search by ticker or company name..."
                    className="glass-input w-full text-lg pr-10"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleAddItem(searchInput)}
                  className="glass-button whitespace-nowrap"
                >
                  Add Stock
                </button>
              </div>
            </div>
            <p className="text-xs text-black dark:text-white/50 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 flex-shrink-0" />
              Pro tip: Search by ticker (e.g., AAPL) or company name (e.g., Apple)
            </p>
          </div>
        </div>

        {/* Quick Add Presets */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-black dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Popular Assets
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { name: 'Treasury Bonds', ticker: 'TLT', icon: Building2, color: 'slate' },
              { name: 'Bitcoin', ticker: 'BTC', icon: Bitcoin, color: 'coral' },
              { name: 'Gold', ticker: 'GLD', icon: DollarSign, color: 'slate' },
              { name: 'S&P 500', ticker: 'SPY', icon: BarChart3, color: 'cyan' },
              { name: 'Tech', ticker: 'QQQ', icon: Wrench, color: 'cyan' },
              { name: 'Energy', ticker: 'XLE', icon: Zap, color: 'coral' },
            ].map((preset) => {
              const IconComponent = preset.icon;
              return (
                <button
                  key={preset.ticker}
                  onClick={() => handleAddItem(preset.ticker)}
                  className={`glass-card-gradient ${preset.color === 'slate' ? 'slate-glow' : preset.color === 'coral' ? 'coral-pink' : preset.color === 'cyan' ? 'cyan-blue' : 'cyan-blue'} p-4 text-center cursor-pointer transform transition-all hover:scale-105 group`}
                >
                  <div className="mb-2 group-hover:scale-110 transition-transform flex justify-center">
                    <IconComponent className="w-8 h-8 text-cyan-400" />
                  </div>
                  <p className="text-xs font-semibold text-black dark:text-white">{preset.name}</p>
                  <p className="text-xs text-black dark:text-white/60">{preset.ticker}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Asset List - Enhanced */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-black dark:text-white flex items-center gap-2">
              <Clipboard className="w-4 h-4" />
              Your Assets <span className="text-cyan-300">({items.length})</span>
            </label>
            {items.length > 0 && (
              <span className="text-xs px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-300">
                Ready to analyze
              </span>
            )}
          </div>

          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="glass-panel p-12 text-center space-y-4">
                <div className="flex justify-center">
                  <MapPin className="w-12 h-12 text-cyan-400" />
                </div>
                <div>
                  <p className="text-lg text-black dark:text-white font-semibold mb-2">No assets added yet</p>
                  <p className="text-black dark:text-white/60">Search for a ticker or use the preset buttons above to get started</p>
                </div>
              </div>
            ) : (
              <>
                {items.map((item, index) => (
                  <div
                    key={item.symbol}
                    className="glass-card group hover:border-cyan-300/50 transition-all"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-300 to-cyan-300 flex items-center justify-center text-lg font-bold text-black dark:text-white">
                          {item.symbol[0]}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-black dark:text-white text-lg">{item.symbol}</p>
                          <p className="text-xs text-black dark:text-white/50">Stock #{index + 1}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 rounded-lg px-4 py-2">
                          <label className="text-sm text-black dark:text-white/70 whitespace-nowrap">Qty:</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.symbol, parseFloat(e.target.value) || 0)
                            }
                            min="0"
                            step="0.01"
                            className="glass-input w-24 bg-black/10 dark:bg-white/10"
                          />
                        </div>
                        <button
                          onClick={() => removeItem(item.symbol)}
                          className="w-10 h-10 rounded-lg bg-red-400/10 border border-red-400/20 text-red-300 hover:bg-red-400/20 transition-all flex items-center justify-center"
                        >
                          <XIcon className="w-5 h-5" />
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
              <p className="text-black dark:text-white/70">Portfolio completeness</p>
              <p className="text-cyan-400 font-semibold">{Math.min(items.length * 20, 100)}%</p>
            </div>
            <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-cyan-300 transition-all duration-300"
                style={{ width: `${Math.min(items.length * 20, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {items.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-50">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="glass-button text-lg font-semibold px-12 py-4 shadow-2xl hover:scale-105 transition-transform max-w-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Portfolio...</span>
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                <span>Analyze Portfolio</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Portal-based Dropdown */}
      {typeof window !== 'undefined' && showDropdown && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            zIndex: 9999,
          }}
        >
          {searchResults.length > 0 ? (
            <div className="max-h-80 overflow-y-auto rounded-2xl bg-white/25 dark:bg-white/25 backdrop-blur-xl border border-white/30 shadow-xl">
              <div className="p-2 space-y-1">
                {searchResults.map((result) => (
                  <button
                    key={result.symbol}
                    onClick={() => handleAddItem(result.symbol, result.name)}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white text-lg">{result.symbol}</span>
                        <span className="text-xs px-2 py-1 rounded bg-cyan-400/30 text-cyan-200 border border-cyan-400/40 font-semibold">
                          {result.exchange}
                        </span>
                      </div>
                      <p className="text-sm text-white/90 mt-1 font-medium">{result.name}</p>
                    </div>
                    <span className="text-white/60 group-hover:text-white transition-colors">→</span>
                  </button>
                ))}
              </div>
            </div>
          ) : !isSearching && searchInput.length > 0 ? (
            <div className="rounded-2xl bg-white/25 dark:bg-white/25 backdrop-blur-xl border border-white/30 shadow-xl p-6 text-center">
              <p className="text-white/90 font-medium">No results found for "{searchInput}"</p>
              <p className="text-xs text-white/70 mt-2">Try a different ticker or company name</p>
            </div>
          ) : null}
        </div>,
        document.body
      )}
    </main>
  );
}
