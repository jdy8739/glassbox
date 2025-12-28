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
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-grass-50 to-sky-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="nature-panel space-y-2 p-6">
          <h1 className="text-3xl font-bold text-grass-700">Portfolio Library</h1>
          <p className="text-rain-600">View and manage your saved portfolios</p>
        </div>

        {/* Portfolio Grid */}
        <div>
          {portfolios.length === 0 ? (
            <div className="nature-panel space-y-6 p-12 text-center">
              <div>
                <p className="mb-2 text-5xl">🌱</p>
                <p className="text-lg text-rain-700">No portfolios saved yet</p>
                <p className="text-sm text-rain-500">Create your first portfolio to get started</p>
              </div>
              <a href="/portfolio/new" className="nature-button inline-block">
                Create Your First Portfolio
              </a>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {portfolios.map((portfolio) => (
                <div key={portfolio.id} className="nature-card group space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-grass-700">{portfolio.name}</h3>
                      <p className="text-sm text-rain-500">{portfolio.date}</p>
                    </div>
                    <button className="opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="text-rain-400 hover:text-red-500">🗑️</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.assets.map((asset) => (
                      <span
                        key={asset}
                        className="nature-badge text-xs"
                      >
                        {asset}
                      </span>
                    ))}
                  </div>
                  <button className="w-full rounded-lg border border-grass-300 bg-grass-50 px-4 py-2 text-sm font-medium text-grass-700 transition-all hover:bg-grass-100">
                    View Analysis
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
