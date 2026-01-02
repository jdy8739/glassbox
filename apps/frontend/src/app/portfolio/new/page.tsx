'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import type { PortfolioItem } from '@glassbox/types';
import { searchTickers, type TickerSearchResult } from '@/lib/api/tickers';

export default function PortfolioBuilder() {
  const router = useRouter();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<TickerSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const searchRef = useRef<HTMLDivElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search for tickers as user types (with debounce)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchInput.trim().length >= 1) {
        setIsSearching(true);
        try {
          const results = await searchTickers(searchInput);
          setSearchResults(results);
          setShowDropdown(true);
        } catch (error) {
          console.error('Failed to search tickers:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchInput]);

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
  }, []);

  const addItem = (symbol: string, name?: string) => {
    const upperSymbol = symbol.toUpperCase();
    if (symbol && !items.find((item) => item.symbol === upperSymbol)) {
      setItems([...items, { symbol: upperSymbol, quantity: 1 }]);
      setSearchInput('');
      setShowDropdown(false);
      setSearchResults([]);

      // Smooth scroll to bottom after item is added
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 100); // Small delay to ensure DOM has updated
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
    // TODO: Send to backend API - for now, just navigate to results page with mock data
    router.push('/analysis/result');
  };

  return (
    <main className="min-h-screen p-6 pb-32">
      {/* Navigation */}
      <nav className="nature-panel mx-auto max-w-4xl mb-8 flex items-center justify-between px-6 py-3 relative z-40 rounded-xl">
        <a href="/" className="text-sm font-semibold text-black dark:text-black/80 dark:text-white/80 hover:text-black dark:text-white transition-colors duration-200 flex items-center gap-2">
          <span>←</span>
          <span>Back</span>
        </a>
        <button
          onClick={handleAnalyze}
          disabled={items.length === 0}
          className="nature-button disabled:opacity-50 disabled:cursor-not-allowed text-xs px-4 py-2 flex items-center gap-1.5"
        >
          <span>📊</span>
          <span>Analyze</span>
        </button>
      </nav>

      <div className="mx-auto max-w-4xl space-y-10">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            <span className="text-sm font-medium text-black dark:text-black/80 dark:text-white/80">Step 1 of 3: Build Portfolio</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-black dark:text-white">
              Build Your
              <br />
              <span className="bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Investment Portfolio
              </span>
            </h1>
            <p className="text-xl text-black dark:text-black/70 dark:text-white/70 max-w-2xl">
              Add your favorite stocks and let our algorithms find the optimal allocation for your risk profile.
            </p>
          </div>
        </div>

        {/* Search Bar - Enhanced with Autocomplete */}
        <div className="nature-card-gradient purple-blue overflow-visible">
          <div className="space-y-4 overflow-visible">
            <label className="block text-sm font-semibold text-black dark:text-white">📍 Add Stock Ticker</label>
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
                    className="nature-input w-full text-lg pr-10"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-grass-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => addItem(searchInput)}
                  className="nature-button whitespace-nowrap"
                >
                  Add Stock
                </button>
              </div>
            </div>
            <p className="text-xs text-black dark:text-black/50 dark:text-white/50">
              💡 Pro tip: Search by ticker (e.g., AAPL) or company name (e.g., Apple)
            </p>
          </div>
        </div>

        {/* Quick Add Presets */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-black dark:text-white">✨ Popular Assets</label>
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
                <p className="text-xs font-semibold text-black dark:text-white">{preset.name}</p>
                <p className="text-xs text-black dark:text-black/60 dark:text-white/60">{preset.ticker}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Asset List - Enhanced */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-black dark:text-white">
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
                  <p className="text-lg text-black dark:text-white font-semibold mb-2">No assets added yet</p>
                  <p className="text-black dark:text-black/60 dark:text-white/60">Search for a ticker or use the preset buttons above to get started</p>
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
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-300 to-cyan-300 flex items-center justify-center text-lg font-bold text-black dark:text-white">
                          {item.symbol[0]}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-black dark:text-white text-lg">{item.symbol}</p>
                          <p className="text-xs text-black dark:text-black/50 dark:text-white/50">Stock #{index + 1}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 rounded-lg px-4 py-2">
                          <label className="text-sm text-black dark:text-black/70 dark:text-white/70 whitespace-nowrap">Qty:</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.symbol, parseFloat(e.target.value) || 0)
                            }
                            min="0"
                            step="0.01"
                            className="nature-input w-24 bg-black/10 dark:bg-white/10"
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
              <p className="text-black dark:text-black/70 dark:text-white/70">Portfolio completeness</p>
              <p className="text-grass-400 font-semibold">{Math.min(items.length * 20, 100)}%</p>
            </div>
            <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
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
                    onClick={() => addItem(result.symbol, result.name)}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white text-lg">{result.symbol}</span>
                        <span className="text-xs px-2 py-1 rounded bg-grass-400/30 text-grass-200 border border-grass-400/40 font-semibold">
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
