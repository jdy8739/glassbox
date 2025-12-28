'use client';

import { useState } from 'react';

export default function AnalysisResult() {
  const [activeTab, setActiveTab] = useState<'frontier' | 'hedging'>('frontier');

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-grass-50 to-sky-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="nature-panel space-y-2 p-6">
          <h1 className="text-3xl font-bold text-grass-700">Analysis Results</h1>
          <p className="text-rain-600">Efficient Frontier and Hedging Recommendations</p>
        </div>

        {/* Tabs */}
        <div className="nature-panel p-6">
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="border-b border-rain-200">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('frontier')}
                  className={`pb-3 font-semibold transition-colors ${
                    activeTab === 'frontier'
                      ? 'border-b-2 border-grass-500 text-grass-700'
                      : 'text-rain-500 hover:text-grass-600'
                  }`}
                >
                  Efficient Frontier
                </button>
                <button
                  onClick={() => setActiveTab('hedging')}
                  className={`pb-3 font-semibold transition-colors ${
                    activeTab === 'hedging'
                      ? 'border-b-2 border-grass-500 text-grass-700'
                      : 'text-rain-500 hover:text-grass-600'
                  }`}
                >
                  Beta Hedging
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'frontier' && (
              <div className="space-y-4">
                <div className="rounded-lg border border-rain-200 bg-sky-50/50 p-8 text-center">
                  <p className="text-rain-600">📊 Efficient Frontier chart visualization coming soon</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="nature-card">
                    <p className="text-sm text-rain-600">Global Minimum Variance</p>
                    <p className="text-2xl font-bold text-grass-700">12.5%</p>
                    <p className="text-xs text-rain-500">Expected Return</p>
                  </div>
                  <div className="nature-card">
                    <p className="text-sm text-rain-600">Maximum Sharpe Ratio</p>
                    <p className="text-2xl font-bold text-grass-700">18.2%</p>
                    <p className="text-xs text-rain-500">Expected Return</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hedging' && (
              <div className="space-y-4">
                <div className="nature-card space-y-4">
                  <div>
                    <p className="text-sm text-rain-600">Current Portfolio Beta</p>
                    <p className="text-4xl font-bold text-grass-700">1.25</p>
                  </div>
                  <div className="border-t border-rain-200 pt-4">
                    <p className="mb-3 text-sm font-semibold text-grass-700">
                      Hedging Recommendation
                    </p>
                    <div className="rounded-lg bg-sky-50 p-4">
                      <p className="text-rain-700">
                        Short <span className="font-bold text-grass-700">42 shares</span> of SPY to achieve
                        market-neutral positioning (β = 0)
                      </p>
                      <p className="mt-2 text-sm text-rain-600">
                        Notional Value: <span className="font-semibold">$18,500</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button className="nature-button">
            Save Portfolio
          </button>
          <button className="nature-button-outline">
            Export Results
          </button>
        </div>
      </div>
    </main>
  );
}
