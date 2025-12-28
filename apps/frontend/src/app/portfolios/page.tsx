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
    <main className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="glass-panel p-6">
          <h1 className="text-3xl font-bold text-white">Portfolio Library</h1>
          <p className="text-white/70">View and manage your saved portfolios</p>
        </div>

        {/* Portfolio Grid */}
        <div>
          {portfolios.length === 0 ? (
            <div className="glass-panel p-12 text-center">
              <p className="mb-4 text-lg text-white/70">No portfolios saved yet</p>
              <a href="/portfolio/new" className="glass-button text-white">
                Create Your First Portfolio
              </a>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {portfolios.map((portfolio) => (
                <div key={portfolio.id} className="glass-panel p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{portfolio.name}</h3>
                      <p className="text-sm text-white/50">{portfolio.date}</p>
                    </div>
                    <button className="text-white/50 hover:text-white">🗑️</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.assets.map((asset) => (
                      <span key={asset} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
