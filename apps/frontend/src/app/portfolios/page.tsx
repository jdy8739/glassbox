'use client';

import { useState } from 'react';

interface SavedPortfolio {
  id: string;
  name: string;
  date: string;
  assets: string[];
}

export default function PortfolioLibrary() {
  const [portfolios] = useState<SavedPortfolio[]>([]);

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse"></span>
            <span className="text-sm font-medium text-white/80">Your Saved Analyses</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-white">
              Portfolio
              <br />
              <span className="bg-gradient-to-r from-gold-300 to-orange-300 bg-clip-text text-transparent">
                Library
              </span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl">
              Manage your saved portfolios, view performance, and explore different allocation strategies.
            </p>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div>
          {portfolios.length === 0 ? (
            <div className="nature-panel space-y-8 p-16 text-center">
              <div className="space-y-4">
                <p className="text-7xl">📦</p>
                <div>
                  <p className="text-2xl font-bold text-white mb-2">No portfolios yet</p>
                  <p className="text-lg text-white/60 mb-6">Start analyzing stocks to build your first portfolio</p>
                </div>
              </div>
              <a href="/portfolio/new" className="nature-button inline-flex gap-2 text-lg px-8 py-4 hover:scale-105 transition-transform">
                <span>🚀</span>
                <span>Create Your First Portfolio</span>
              </a>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {portfolios.map((portfolio, index) => (
                <div
                  key={portfolio.id}
                  className={`nature-card-gradient ${index % 4 === 0 ? 'purple-blue' : index % 4 === 1 ? 'coral-pink' : index % 4 === 2 ? 'gold-cyan' : 'indigo-green'} group cursor-pointer transform transition-all hover:scale-105 space-y-4`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-grass-300 transition">{portfolio.name}</h3>
                      <p className="text-sm text-white/60">Analyzed on {portfolio.date}</p>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-lg bg-red-400/10 border border-red-400/20 text-red-300 hover:bg-red-400/20 flex items-center justify-center">
                      🗑️
                    </button>
                  </div>

                  <div>
                    <p className="text-xs text-white/60 mb-2">Assets in portfolio:</p>
                    <div className="flex flex-wrap gap-2">
                      {portfolio.assets.slice(0, 4).map((asset) => (
                        <span
                          key={asset}
                          className="nature-badge text-xs"
                        >
                          {asset}
                        </span>
                      ))}
                      {portfolio.assets.length > 4 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
                          +{portfolio.assets.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <button className="w-full rounded-lg bg-gradient-to-r from-grass-400 to-cyan-300 px-4 py-2 text-sm font-semibold text-white hover:shadow-lg transition-all">
                    View Analysis →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
