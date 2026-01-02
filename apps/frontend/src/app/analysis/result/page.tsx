'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useFetchPortfolioData } from './useFetchPortfolioData';

function AnalysisResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const portfolioId = searchParams.get('portfolioId');

  const [activeTab, setActiveTab] = useState<'frontier' | 'hedging'>('frontier');
  
  const { 
    portfolioData, 
    isLoading, 
    isError, 
    reanalyze, 
    isReanalyzing 
  } = useFetchPortfolioData(portfolioId);

  // Redirect on error or missing data
  useEffect(() => {
    if (isError) {
      router.push('/portfolio/new');
    }
  }, [isError, router]);

  const handleReanalyze = () => {
    if (!portfolioData?.savedPortfolio) return;
    
    reanalyze({
      tickers: portfolioData.savedPortfolio.tickers,
      quantities: portfolioData.savedPortfolio.quantities,
    });
  };

  const handleSavePortfolio = () => {
    if (portfolioId) {
      // Update existing portfolio
      // TODO: Implement API call to PUT /api/portfolios/:id
    } else {
      // Create new portfolio - show modal for name input
      // TODO: Implement save modal
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-black dark:text-white text-lg">Loading analysis...</p>
        </div>
      </main>
    );
  }

  // If we have no data and not loading, the useEffect will redirect.
  // We can return null or a skeleton here.
  if (!portfolioData) return null;

  const { analysis: analysisData, items: portfolioItems, savedPortfolio } = portfolioData;
  const isSnapshot = !!savedPortfolio;

  const backLink = isSnapshot ? '/portfolios' : '/portfolio/new';

  return (
    <main className="min-h-screen p-6">
      {/* Navigation */}
      <nav className="nature-panel mx-auto max-w-6xl mb-8 flex items-center justify-between px-6 py-3 relative z-40 rounded-xl">
        <a href={backLink} className="text-sm font-semibold text-black/80 dark:text-white/80 hover:text-black dark:text-white transition-colors duration-200 flex items-center gap-2">
          <span>←</span>
          <span>Back</span>
        </a>
        <div className="flex gap-2">
          {isSnapshot && !isReanalyzing && (
            <button
              onClick={handleReanalyze}
              className="nature-button-secondary text-xs px-3 py-2 flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span>Re-analyze</span>
            </button>
          )}
          <button className="nature-button-outline text-xs px-3 py-2 flex items-center gap-1.5">
            <span>📥</span>
            <span>Export</span>
          </button>
          <button
            onClick={handleSavePortfolio}
            className="nature-button text-xs px-3 py-2 flex items-center gap-1.5"
            disabled={isReanalyzing}
          >
            <span>💾</span>
            <span>{isSnapshot ? 'Update' : 'Save'}</span>
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse"></span>
            <span className="text-sm font-medium text-black/80 dark:text-white/80">
              {isSnapshot ? 'Saved Portfolio' : 'Step 2 of 3: Review Analysis'}
              {isReanalyzing && ' • Re-analyzing...'}
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-black dark:text-white">
              Analysis
              <br />
              <span className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                Results
              </span>
            </h1>
            <p className="text-xl text-black/70 dark:text-white/70 max-w-2xl">
              {isSnapshot
                ? savedPortfolio?.name
                  ? `Portfolio: ${savedPortfolio.name} (${savedPortfolio.tickers.join(', ')})`
                  : 'View your saved portfolio analysis'
                : portfolioItems.length > 0
                ? `Analyzing ${portfolioItems.length} assets: ${portfolioItems.map(i => i.symbol).join(', ')}`
                : 'Explore your efficient frontier and hedging recommendations for optimal portfolio allocation.'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          {/* Tab Navigation - Enhanced */}
          <div className="flex gap-2 border-b border-white/10">
            <button
              onClick={() => setActiveTab('frontier')}
              className={`px-6 py-4 font-semibold transition-all border-b-2 ${
                activeTab === 'frontier'
                  ? 'border-b-cyan-300 text-cyan-300'
                  : 'border-b-transparent text-black/50 dark:text-white/50 hover:text-black/70 dark:text-white/70'
              }`}
            >
              📈 Efficient Frontier
            </button>
            <button
              onClick={() => setActiveTab('hedging')}
              className={`px-6 py-4 font-semibold transition-all border-b-2 ${
                activeTab === 'hedging'
                  ? 'border-b-coral-300 text-coral-300'
                  : 'border-b-transparent text-black/50 dark:text-white/50 hover:text-black/70 dark:text-white/70'
              }`}
            >
              🛡️ Beta Hedging
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'frontier' && (
            <div className="space-y-6 animate-fade-in">
              {/* Chart Placeholder */}
              <div className="nature-card-gradient purple-blue p-12 text-center">
                <div className="space-y-4">
                  <p className="text-5xl">📊</p>
                  <div>
                    <p className="text-2xl font-bold text-black dark:text-white mb-2">Efficient Frontier</p>
                    <p className="text-black/60 dark:text-white/60">Interactive chart visualization coming soon</p>
                  </div>
                </div>
              </div>

              {/* Portfolio Metrics Grid */}
              {analysisData && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-black dark:text-white">Optimal Portfolios</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Global Minimum Variance */}
                    <div className="nature-card-gradient gold-cyan group cursor-pointer transform transition-all hover:scale-105">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm text-black/60 dark:text-white/60 mb-2">Global Minimum Variance (GMV)</p>
                          <p className="text-3xl font-bold text-black dark:text-white">
                            {(analysisData.gmv.stats.return * 100).toFixed(1)}%
                          </p>
                          <p className="text-xs text-black/50 dark:text-white/50 mt-1">Expected Annual Return</p>
                        </div>
                        <div className="text-3xl">🎯</div>
                      </div>
                      <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                        <p className="text-xs text-black/60 dark:text-white/60">Portfolio Volatility</p>
                        <p className="text-2xl font-bold text-black dark:text-white">
                          {(analysisData.gmv.stats.volatility * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                        <p className="text-xs text-black/60 dark:text-white/60">Sharpe Ratio</p>
                        <p className="text-2xl font-bold text-black dark:text-white">
                          {analysisData.gmv.stats.sharpe.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Maximum Sharpe Ratio */}
                    <div className="nature-card-gradient coral-pink group cursor-pointer transform transition-all hover:scale-105">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm text-black/60 dark:text-white/60 mb-2">Maximum Sharpe Ratio</p>
                          <p className="text-3xl font-bold text-black dark:text-white">
                            {(analysisData.maxSharpe.stats.return * 100).toFixed(1)}%
                          </p>
                          <p className="text-xs text-black/50 dark:text-white/50 mt-1">Expected Annual Return</p>
                        </div>
                        <div className="text-3xl">⚡</div>
                      </div>
                      <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                        <p className="text-xs text-black/60 dark:text-white/60">Portfolio Volatility</p>
                        <p className="text-2xl font-bold text-black dark:text-white">
                          {(analysisData.maxSharpe.stats.volatility * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                        <p className="text-xs text-black/60 dark:text-white/60">Sharpe Ratio</p>
                        <p className="text-2xl font-bold text-black dark:text-white">
                          {analysisData.maxSharpe.stats.sharpe.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Weights Table */}
              {analysisData && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-black dark:text-white">
                    Optimal Weights (Max Sharpe Portfolio)
                  </h3>
                  <div className="nature-card p-6 space-y-3">
                    {Object.entries(analysisData.maxSharpe.weights)
                      .filter(([_, weight]) => (weight as number) > 0.001) // Only show weights > 0.1%
                      .sort((a, b) => (b[1] as number) - (a[1] as number)) // Sort by weight descending
                      .map(([ticker, weight], index, array) => (
                        <div
                          key={ticker}
                          className={`flex items-center justify-between py-3 ${
                            index < array.length - 1 ? 'border-b border-white/10' : ''
                          }`}
                        >
                          <span className="text-black dark:text-white font-medium">{ticker}</span>
                          <span className="text-grass-400 font-bold">{((weight as number) * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'hedging' && analysisData && (
            <div className="space-y-6 animate-fade-in">
              {/* Beta Metrics */}
              <div className="grid gap-6 md:grid-cols-3">
                {/* Current Beta */}
                <div className="nature-card-gradient indigo-green group cursor-pointer transform transition-all hover:scale-105">
                  <div className="text-3xl mb-4">📊</div>
                  <p className="text-sm text-black/60 dark:text-white/60 mb-2">Current Portfolio Beta</p>
                  <p className="text-4xl font-bold text-black dark:text-white">
                    {analysisData.portfolioBeta.toFixed(2)}
                  </p>
                  <p className="text-xs text-black/50 dark:text-white/50 mt-2">Market Exposure</p>
                </div>

                {/* Target Beta */}
                <div className="nature-card-gradient purple-blue group cursor-pointer transform transition-all hover:scale-105">
                  <div className="text-3xl mb-4">🎯</div>
                  <p className="text-sm text-black/60 dark:text-white/60 mb-2">Target Beta</p>
                  <p className="text-4xl font-bold text-black dark:text-white">0.00</p>
                  <p className="text-xs text-black/50 dark:text-white/50 mt-2">Market Neutral</p>
                </div>

                {/* Required Hedge */}
                <div className="nature-card-gradient gold-cyan group cursor-pointer transform transition-all hover:scale-105">
                  <div className="text-3xl mb-4">🛡️</div>
                  <p className="text-sm text-black/60 dark:text-white/60 mb-2">Hedge Required</p>
                  <p className="text-4xl font-bold text-black dark:text-white">
                    {analysisData.portfolioBeta.toFixed(2)}
                  </p>
                  <p className="text-xs text-black/50 dark:text-white/50 mt-2">Beta Reduction Needed</p>
                </div>
              </div>

              {/* Hedging Recommendation */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-black dark:text-white">Hedging Strategy</h3>
                <div className="nature-card space-y-6">
                  {/* SPY Method */}
                  <div className="space-y-4 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📈</span>
                      <h4 className="text-lg font-semibold text-black dark:text-white">SPY ETF Hedging</h4>
                    </div>
                    <div className="bg-black/5 dark:bg-white/5 rounded-lg p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-black/70 dark:text-white/70">Action:</span>
                        <span className="font-bold text-coral-300">
                          Short {Math.abs(analysisData.hedging.spyShares)} shares
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-black/70 dark:text-white/70">Notional Value:</span>
                        <span className="font-bold text-black dark:text-white">
                          ${Math.abs(analysisData.hedging.spyNotional).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-black/70 dark:text-white/70">Resulting Beta:</span>
                        <span className="font-bold text-grass-400">~0.00</span>
                      </div>
                    </div>
                  </div>

                  {/* ES Futures Method */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚡</span>
                      <h4 className="text-lg font-semibold text-black dark:text-white">ES Futures Hedging</h4>
                    </div>
                    <div className="bg-black/5 dark:bg-white/5 rounded-lg p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-black/70 dark:text-white/70">Action:</span>
                        <span className="font-bold text-coral-300">
                          Short {Math.abs(analysisData.hedging.esContracts)} contracts
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-black/70 dark:text-white/70">Notional Value:</span>
                        <span className="font-bold text-black dark:text-white">
                          ${Math.abs(analysisData.hedging.esNotional).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-black/70 dark:text-white/70">Resulting Beta:</span>
                        <span className="font-bold text-grass-400">~0.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Insights */}
              <div className="nature-card-gradient coral-pink space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h4 className="font-semibold text-black dark:text-white mb-2">Key Insights</h4>
                    <ul className="text-black/70 dark:text-white/70 space-y-2 text-sm">
                      <li>
                        ✓ Your portfolio has a beta of{' '}
                        <span className="text-black dark:text-white">{analysisData.portfolioBeta.toFixed(2)}</span>
                        {analysisData.portfolioBeta > 1 && `, meaning it's ${((analysisData.portfolioBeta - 1) * 100).toFixed(0)}% more volatile than the market`}
                        {analysisData.portfolioBeta < 1 && `, meaning it's ${((1 - analysisData.portfolioBeta) * 100).toFixed(0)}% less volatile than the market`}
                        {analysisData.portfolioBeta === 1 && ', meaning it moves in line with the market'}
                      </li>
                      <li>✓ Hedging via SPY is more accessible for retail investors</li>
                      <li>✓ ES futures provide <span className="text-black dark:text-white">capital efficiency</span> for larger portfolios</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function AnalysisResult() {
  return (
    <Suspense fallback={<div className="min-h-screen p-6 flex items-center justify-center"><div className="text-black dark:text-white">Loading...</div></div>}>
      <AnalysisResultContent />
    </Suspense>
  );
}
