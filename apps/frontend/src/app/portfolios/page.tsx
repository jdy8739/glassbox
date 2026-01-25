'use client';

import { useState, useEffect } from 'react';
import { Package, Rocket, Search, SlidersHorizontal } from 'lucide-react';
import { PortfolioCard } from './components/PortfolioCard';
import type { Portfolio } from '@glassbox/types';

// Mock Data with rich stats
const MOCK_PORTFOLIOS: Portfolio[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Tech Growth Aggressive',
    tickers: ['AAPL', 'MSFT', 'NVDA', 'AMD'],
    quantities: [50, 40, 30, 100],
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2024-01-20'),
    analysisSnapshot: {
      efficientFrontier: [],
      gmv: { weights: {}, stats: { return: 0.1, volatility: 0.12, sharpe: 0.8 } },
      maxSharpe: { 
        weights: {}, 
        stats: { return: 0.245, volatility: 0.18, sharpe: 1.36 } 
      },
      portfolioBeta: 1.25,
      riskFreeRate: 0.045,
      hedging: { spyShares: 0, spyNotional: 0, esContracts: 0, esNotional: 0 }
    }
  },
  {
    id: '2',
    userId: 'user1',
    name: 'Balanced 60/40',
    tickers: ['SPY', 'TLT'],
    quantities: [60, 40],
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date('2023-12-05'),
    analysisSnapshot: {
      efficientFrontier: [],
      gmv: { weights: {}, stats: { return: 0.08, volatility: 0.09, sharpe: 0.88 } },
      maxSharpe: { 
        weights: {}, 
        stats: { return: 0.095, volatility: 0.11, sharpe: 0.86 } 
      },
      portfolioBeta: 0.60,
      riskFreeRate: 0.045,
      hedging: { spyShares: 0, spyNotional: 0, esContracts: 0, esNotional: 0 }
    }
  },
  {
    id: '3',
    userId: 'user1',
    name: 'Crypto & Gold Hedge',
    tickers: ['BTC', 'ETH', 'GLD'],
    quantities: [2, 15, 50],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-24'),
    analysisSnapshot: {
      efficientFrontier: [],
      gmv: { weights: {}, stats: { return: 0.15, volatility: 0.25, sharpe: 0.6 } },
      maxSharpe: { 
        weights: {}, 
        stats: { return: 0.45, volatility: 0.35, sharpe: 1.28 } 
      },
      portfolioBeta: 0.8,
      riskFreeRate: 0.045,
      hedging: { spyShares: 0, spyNotional: 0, esContracts: 0, esNotional: 0 }
    }
  },
  {
    id: '4',
    userId: 'user1',
    name: 'Dividend Aristocrats',
    tickers: ['O', 'KO', 'JNJ', 'PG', 'MMM'],
    quantities: [100, 200, 50, 80, 40],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    analysisSnapshot: {
      efficientFrontier: [],
      gmv: { weights: {}, stats: { return: 0.07, volatility: 0.10, sharpe: 0.7 } },
      maxSharpe: { 
        weights: {}, 
        stats: { return: 0.085, volatility: 0.12, sharpe: 0.71 } 
      },
      portfolioBeta: 0.55,
      riskFreeRate: 0.045,
      hedging: { spyShares: 0, spyNotional: 0, esContracts: 0, esNotional: 0 }
    }
  }
];

const CHART_COLORS = [
  '#06b6d4', // Cyan 500
  '#f472b6', // Pink 400
  '#a78bfa', // Violet 400
  '#fbbf24', // Amber 400
  '#34d399', // Emerald 400
  '#60a5fa', // Blue 400
];

export default function PortfolioLibrary() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API Fetch
    setTimeout(() => {
      setPortfolios(MOCK_PORTFOLIOS);
      setLoading(false);
    }, 800);
  }, []);

  const handleDeletePortfolio = async (portfolioId: string) => {
    // In a real app, use a custom modal
    if (!confirm('Are you sure you want to delete this portfolio?')) return;

    setDeleting(portfolioId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      setPortfolios(portfolios.filter(p => p.id !== portfolioId));
    } catch (error) {
      console.error('Error deleting portfolio:', error);
    } finally {
      setDeleting(null);
    }
  };

  const filteredPortfolios = portfolios.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tickers.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
              <span className="text-xs font-semibold text-black/70 dark:text-white/70">Library</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-black dark:text-white">
              Your <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">Portfolios</span>
            </h1>
            <p className="text-lg text-black/60 dark:text-white/60 max-w-xl">
              Manage your saved strategies and track their theoretical performance over time.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-auto relative group">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-pink-400 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
             <div className="relative flex items-center bg-white/80 dark:bg-black/80 rounded-xl px-4 py-3 min-w-[300px] border border-black/5 dark:border-white/10 shadow-sm">
               <Search className="w-5 h-5 text-black/40 dark:text-white/40 mr-3" />
               <input 
                 type="text" 
                 placeholder="Search portfolios..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="bg-transparent border-none focus:outline-none text-black dark:text-white w-full font-medium"
               />
               <SlidersHorizontal className="w-4 h-4 text-black/40 dark:text-white/40 ml-2 cursor-pointer hover:text-black dark:hover:text-white transition-colors" />
             </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
             {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
               <div key={i} className="glass-panel h-[280px] animate-pulse bg-black/5 dark:bg-white/5" />
             ))}
          </div>
        ) : filteredPortfolios.length === 0 ? (
          <div className="glass-panel py-20 text-center space-y-6 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
              <Package className="w-8 h-8 text-black/30 dark:text-white/30" />
            </div>
            <div>
              <p className="text-xl font-bold text-black dark:text-white mb-2">
                {searchQuery ? 'No portfolios found' : 'Your library is empty'}
              </p>
              <p className="text-black/50 dark:text-white/50 max-w-sm mx-auto">
                {searchQuery 
                  ? `No results matching "${searchQuery}". Try a different term.`
                  : "Start analyzing stocks to create your first optimized portfolio strategy."}
              </p>
            </div>
            {!searchQuery && (
              <a href="/portfolio/new" className="glass-button px-8 py-3">
                <Rocket className="w-5 h-5 mr-2" />
                Create Portfolio
              </a>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Create New Card (Always first) */}
            <a href="/portfolio/new" className="group glass-panel border-dashed border-2 border-black/10 dark:border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all p-6 flex flex-col items-center justify-center text-center gap-4 min-h-[280px]">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Rocket className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-black dark:text-white">New Portfolio</h3>
                <p className="text-xs text-black/50 dark:text-white/50 mt-1">Start a fresh analysis</p>
              </div>
            </a>

            {/* Portfolio Cards */}
            {filteredPortfolios.map((portfolio) => (
              <PortfolioCard 
                key={portfolio.id} 
                portfolio={portfolio} 
                onDelete={handleDeletePortfolio}
                isDeleting={deleting === portfolio.id}
                colors={CHART_COLORS}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}