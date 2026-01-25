'use client';

import { Sparkles, TrendingUp, Lightbulb, MapPin, Rocket, Layers } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { usePortfolioBuilder } from './usePortfolioBuilder';
import { AssetList } from './components/AssetList';
import { StarterTemplates } from './components/StarterTemplates';
import { QuickAddAssets } from './components/QuickAddAssets';
import { HeaderPortal } from '@/lib/header-context';

const PortfolioDonutChart = dynamic(
  () => import('./components/PortfolioDonutChart').then((mod) => mod.PortfolioDonutChart),
  {
    loading: () => (
      <div className="w-full h-[250px] flex items-center justify-center">
        <div className="w-48 h-48 rounded-full border-[16px] border-black/5 dark:border-white/5 animate-pulse" />
      </div>
    ),
    ssr: false
  }
);

const CHART_COLORS = [
  '#06b6d4', // Cyan 500
  '#f472b6', // Pink 400
  '#a78bfa', // Violet 400
  '#fbbf24', // Amber 400
  '#34d399', // Emerald 400
  '#60a5fa', // Blue 400
];

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
    loadTemplate,
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
      // Smooth scroll happens via React state update, no need for manual scroll
    }
  };

  return (
    <main className="min-h-screen px-6 pt-8 pb-32">
      <HeaderPortal
        nav={
          <a href="/" className="text-sm font-semibold text-black dark:text-white/80 hover:text-black dark:text-white transition-colors duration-200 flex items-center gap-2">
            <span>←</span>
            <span>Back</span>
          </a>
        }
        actions={
          <button
            onClick={handleAnalyze}
            disabled={items.length === 0 || isAnalyzing}
            className="hidden lg:flex h-9 px-3 items-center gap-2 rounded-lg text-xs font-medium text-slate-700 dark:text-white/80 bg-white/10 dark:bg-slate-800/50 border border-black/5 dark:border-white/10 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
        }
      />

      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Workbench (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Header Section */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                <span className="text-sm font-medium text-black dark:text-white/80">Step 1: Build Portfolio</span>
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
                  Mix and match assets to create your perfect portfolio.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {analysisError && (
              <div className="glass-card-gradient coral-pink animate-fade-in">
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

            {/* Search Bar */}
            <div className="glass-card-gradient cyan-blue overflow-visible relative z-30">
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
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && searchInput) {
                            handleAddItem(searchInput);
                          }
                        }}
                        placeholder="Search ticker (e.g. AAPL)..."
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
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Add Assets */}
            <QuickAddAssets onAdd={handleAddItem} />

            {/* Main Content Area */}
            <div className="space-y-6">
              {items.length === 0 ? (
                /* Empty State: Starter Templates */
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-2 text-black dark:text-white">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-semibold">Start with a Template</h3>
                  </div>
                  <StarterTemplates onSelect={loadTemplate} />
                </div>
              ) : (
                /* List of Assets */
                <div className="space-y-4 animate-fade-in">
                   <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-black dark:text-white flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      Your Assets
                    </label>
                    <button 
                      onClick={() => loadTemplate([])}
                      className="text-xs text-red-400 hover:text-red-500 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  <AssetList 
                    items={items} 
                    colors={CHART_COLORS}
                    onRemove={removeItem}
                    onUpdateQuantity={updateQuantity}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Summary Panel (4 cols) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-24">
            <div className="glass-panel p-6 space-y-6">
              <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Live Preview
              </h3>
              
              {/* Donut Chart */}
              <PortfolioDonutChart items={items} colors={CHART_COLORS} />

              {/* Stats Summary */}
              {items.length > 0 && (
                <div className="grid grid-cols-2 gap-3 py-4 border-t border-b border-black/10 dark:border-white/10">
                  <div>
                    <p className="text-xs text-black/50 dark:text-white/50">Total Assets</p>
                    <p className="text-lg font-bold text-black dark:text-white">{items.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 dark:text-white/50">Est. Value</p>
                    <p className="text-lg font-bold text-black dark:text-white">$100k</p>
                  </div>
                </div>
              )}

              {/* Main CTA */}
              <button
                onClick={handleAnalyze}
                disabled={items.length === 0 || isAnalyzing}
                className="w-full glass-button text-lg py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                    <span>Analyze Portfolio</span>
                  </>
                )}
              </button>
              
              {items.length === 0 && (
                <p className="text-xs text-center text-black/40 dark:text-white/40">
                  Add at least one asset to enable analysis.
                </p>
              )}
            </div>
            
            {/* Helper Tip */}
            <div className="mt-3 glass-panel p-4 rounded-xl">
               <div className="flex gap-3">
                 <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                 <p className="text-xs text-black/70 dark:text-white/70 leading-relaxed">
                   <strong>Pro Tip:</strong> Try to include a mix of assets (Stocks, Bonds, Crypto) to see how diversification affects your efficient frontier.
                 </p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-white/20 z-50 lg:hidden">
        <div className="flex items-center gap-4 max-w-lg mx-auto">
          <div className="flex-1">
            <p className="text-xs text-black/50 dark:text-white/50 font-medium">Portfolio Summary</p>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-black dark:text-white">{items.length} Assets</span>
              <span className="text-sm text-black/60 dark:text-white/60">~ $100k</span>
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={items.length === 0 || isAnalyzing}
            className="glass-button px-6 py-3 flex items-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Rocket className="w-4 h-4" />
            )}
            <span>Analyze</span>
          </button>
        </div>
      </div>

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