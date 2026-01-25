'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Rocket, Trash2 } from 'lucide-react';

interface SavedPortfolio {
  id: string;
  name: string;
  tickers: string[];
  quantities: number[];
  updatedAt: string;
  createdAt: string;
}

export default function PortfolioLibrary() {
  const [portfolios, setPortfolios] = useState<SavedPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Implement API call to GET /api/portfolios
    // const response = await fetch('/api/portfolios');
    // const data = await response.json();
    // setPortfolios(data);
    setLoading(false);
  }, []);

  const handleDeletePortfolio = async (portfolioId: string) => {
    if (!confirm('Are you sure you want to delete this portfolio?')) return;

    setDeleting(portfolioId);
    try {
      // TODO: Implement API call to DELETE /api/portfolios/:id
      // await fetch(`/api/portfolios/${portfolioId}`, { method: 'DELETE' });
      setPortfolios(portfolios.filter(p => p.id !== portfolioId));
    } catch (error) {
      console.error('Error deleting portfolio:', error);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></span>
            <span className="text-sm font-medium text-black dark:text-white/80">Your Saved Analyses</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-black dark:text-white">
              Portfolio
              <br />
              <span className="bg-gradient-to-r from-slate-300 to-orange-300 bg-clip-text text-transparent">
                Library
              </span>
            </h1>
            <p className="text-xl text-black dark:text-white/70 max-w-2xl">
              Manage your saved portfolios, view performance, and explore different allocation strategies.
            </p>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div>
          {portfolios.length === 0 ? (
            <div className="glass-panel space-y-8 p-16 text-center">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Package className="w-16 h-16 text-cyan-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-black dark:text-white mb-2">No portfolios yet</p>
                  <p className="text-lg text-black dark:text-white/60 mb-6">Start analyzing stocks to build your first portfolio</p>
                </div>
              </div>
              <a href="/portfolio/new" className="glass-button inline-flex gap-2 text-lg px-8 py-4 hover:scale-105 transition-transform">
                <Rocket className="w-5 h-5" />
                <span>Create Your First Portfolio</span>
              </a>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {portfolios.map((portfolio, index) => (
                <div
                  key={portfolio.id}
                  className={`glass-card-gradient ${index % 4 === 0 ? 'cyan-blue' : index % 4 === 1 ? 'coral-pink' : index % 4 === 2 ? 'slate-glow' : 'cyan-blue'} group transform transition-all hover:scale-105 space-y-4`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-black dark:text-white mb-1 group-hover:text-cyan-300 transition">{portfolio.name}</h3>
                      <p className="text-sm text-black dark:text-white/60">Updated {formatDate(portfolio.updatedAt)}</p>
                    </div>
                    <button
                      onClick={() => handleDeletePortfolio(portfolio.id)}
                      disabled={deleting === portfolio.id}
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-lg bg-red-400/10 border border-red-400/20 text-red-300 hover:bg-red-400/20 flex items-center justify-center disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <p className="text-xs text-black dark:text-white/60 mb-2">Assets in portfolio:</p>
                    <div className="flex flex-wrap gap-2">
                      {portfolio.tickers.slice(0, 4).map((ticker) => (
                        <span
                          key={ticker}
                          className="glass-badge text-xs"
                        >
                          {ticker}
                        </span>
                      ))}
                      {portfolio.tickers.length > 4 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-black/10 dark:bg-white/10 text-black dark:text-white/70">
                          +{portfolio.tickers.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/analysis/result?portfolioId=${portfolio.id}`}
                    className="block w-full rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-300 px-4 py-2 text-sm font-semibold text-black dark:text-white hover:shadow-lg transition-all text-center"
                  >
                    View Analysis →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
