'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface AnalysisSnapshot {
  efficientFrontier: Array<{ return: number; volatility: number; sharpeRatio: number }>;
  gmv: { weights: Record<string, number>; stats: { return: number; volatility: number; sharpe: number } };
  maxSharpe: { weights: Record<string, number>; stats: { return: number; volatility: number; sharpe: number } };
  portfolioBeta: number;
  hedging: {
    spyShares: number;
    spyNotional: number;
    esContracts: number;
    esNotional: number;
  };
}

interface SavedPortfolio {
  id: string;
  name: string;
  tickers: string[];
  quantities: number[];
  analysisSnapshot: AnalysisSnapshot;
  updatedAt: string;
}

function AnalysisResultContent() {
  const searchParams = useSearchParams();
  const portfolioId = searchParams.get('portfolioId');

  const [activeTab, setActiveTab] = useState<'frontier' | 'hedging'>('frontier');
  const [isSnapshot, setIsSnapshot] = useState(!!portfolioId);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [savedPortfolio, setSavedPortfolio] = useState<SavedPortfolio | null>(null);
  const [loading, setLoading] = useState(!!portfolioId);

  useEffect(() => {
    if (portfolioId) {
      // Load saved portfolio snapshot from API
      setLoading(true);
      // TODO: Implement API call to GET /api/portfolios/:id
      // const response = await fetch(`/api/portfolios/${portfolioId}`);
      // const data = await response.json();
      // setSavedPortfolio(data);
      setLoading(false);
    }
  }, [portfolioId]);

  const handleReanalyze = () => {
    if (!savedPortfolio) return;
    setIsReanalyzing(true);
    // TODO: Implement API call to POST /api/analyze with tickers/quantities
    // This will fetch fresh market data and run analysis
    setTimeout(() => {
      setIsReanalyzing(false);
      setIsSnapshot(false); // Switch to edit mode after re-analysis
    }, 2000);
  };

  const handleSavePortfolio = () => {
    if (isSnapshot) {
      // Update existing portfolio
      // TODO: Implement API call to PUT /api/portfolios/:id
    } else {
      // Create new portfolio - show modal for name input
      // TODO: Implement save modal
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white text-lg">Loading analysis...</p>
        </div>
      </main>
    );
  }

  const backLink = isSnapshot ? '/portfolios' : '/portfolio/new';

  return (
    <main className="min-h-screen p-6">
      {/* Navigation */}
      <nav className="nature-panel mx-auto max-w-6xl mb-12 flex items-center justify-between px-6 py-4 relative z-50">
        <a href={backLink} className="text-2xl font-bold text-white hover:text-grass-400 transition">
          ← Back
        </a>
        <div className="flex gap-3">
          {isSnapshot && !isReanalyzing && (
            <button
              onClick={handleReanalyze}
              className="nature-button-secondary text-sm"
            >
              🔄 Re-analyze
            </button>
          )}
          <button className="nature-button-outline text-sm">
            Export Results
          </button>
          <button
            onClick={handleSavePortfolio}
            className="nature-button text-sm"
            disabled={isReanalyzing}
          >
            {isSnapshot ? '💾 Update Portfolio' : '💾 Save Portfolio'}
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse"></span>
            <span className="text-sm font-medium text-white/80">
              {isSnapshot ? 'Saved Portfolio' : 'Step 2 of 3: Review Analysis'}
              {isReanalyzing && ' • Re-analyzing...'}
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-white">
              Analysis
              <br />
              <span className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                Results
              </span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl">
              {isSnapshot
                ? savedPortfolio?.name
                  ? `Portfolio: ${savedPortfolio.name} (${savedPortfolio.tickers.join(', ')})`
                  : 'View your saved portfolio analysis'
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
                  : 'border-b-transparent text-white/50 hover:text-white/70'
              }`}
            >
              📈 Efficient Frontier
            </button>
            <button
              onClick={() => setActiveTab('hedging')}
              className={`px-6 py-4 font-semibold transition-all border-b-2 ${
                activeTab === 'hedging'
                  ? 'border-b-coral-300 text-coral-300'
                  : 'border-b-transparent text-white/50 hover:text-white/70'
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
                    <p className="text-2xl font-bold text-white mb-2">Efficient Frontier</p>
                    <p className="text-white/60">Interactive chart visualization coming soon</p>
                  </div>
                </div>
              </div>

              {/* Portfolio Metrics Grid */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Optimal Portfolios</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Global Minimum Variance */}
                  <div className="nature-card-gradient gold-cyan group cursor-pointer transform transition-all hover:scale-105">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm text-white/60 mb-2">Global Minimum Variance (GMV)</p>
                        <p className="text-3xl font-bold text-white">12.5%</p>
                        <p className="text-xs text-white/50 mt-1">Expected Annual Return</p>
                      </div>
                      <div className="text-3xl">🎯</div>
                    </div>
                    <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                      <p className="text-xs text-white/60">Portfolio Volatility</p>
                      <p className="text-2xl font-bold text-white">8.3%</p>
                    </div>
                  </div>

                  {/* Maximum Sharpe Ratio */}
                  <div className="nature-card-gradient coral-pink group cursor-pointer transform transition-all hover:scale-105">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm text-white/60 mb-2">Maximum Sharpe Ratio</p>
                        <p className="text-3xl font-bold text-white">18.2%</p>
                        <p className="text-xs text-white/50 mt-1">Expected Annual Return</p>
                      </div>
                      <div className="text-3xl">⚡</div>
                    </div>
                    <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                      <p className="text-xs text-white/60">Portfolio Volatility</p>
                      <p className="text-2xl font-bold text-white">15.7%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weights Table */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Optimal Weights</h3>
                <div className="nature-card p-6 space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-white font-medium">AAPL</span>
                    <span className="text-grass-400 font-bold">24.5%</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-white font-medium">MSFT</span>
                    <span className="text-grass-400 font-bold">18.2%</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-white font-medium">NVDA</span>
                    <span className="text-grass-400 font-bold">15.8%</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-white font-medium">GOOG</span>
                    <span className="text-grass-400 font-bold">12.3%</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-white font-medium">TSLA</span>
                    <span className="text-grass-400 font-bold">10.1%</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-white font-medium">SGOV</span>
                    <span className="text-grass-400 font-bold">19.1%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hedging' && (
            <div className="space-y-6 animate-fade-in">
              {/* Beta Metrics */}
              <div className="grid gap-6 md:grid-cols-3">
                {/* Current Beta */}
                <div className="nature-card-gradient indigo-green group cursor-pointer transform transition-all hover:scale-105">
                  <div className="text-3xl mb-4">📊</div>
                  <p className="text-sm text-white/60 mb-2">Current Portfolio Beta</p>
                  <p className="text-4xl font-bold text-white">1.25</p>
                  <p className="text-xs text-white/50 mt-2">Market Exposure</p>
                </div>

                {/* Target Beta */}
                <div className="nature-card-gradient purple-blue group cursor-pointer transform transition-all hover:scale-105">
                  <div className="text-3xl mb-4">🎯</div>
                  <p className="text-sm text-white/60 mb-2">Target Beta</p>
                  <p className="text-4xl font-bold text-white">0.00</p>
                  <p className="text-xs text-white/50 mt-2">Market Neutral</p>
                </div>

                {/* Required Hedge */}
                <div className="nature-card-gradient gold-cyan group cursor-pointer transform transition-all hover:scale-105">
                  <div className="text-3xl mb-4">🛡️</div>
                  <p className="text-sm text-white/60 mb-2">Hedge Required</p>
                  <p className="text-4xl font-bold text-white">1.25</p>
                  <p className="text-xs text-white/50 mt-2">Beta Reduction Needed</p>
                </div>
              </div>

              {/* Hedging Recommendation */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Hedging Strategy</h3>
                <div className="nature-card space-y-6">
                  {/* SPY Method */}
                  <div className="space-y-4 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📈</span>
                      <h4 className="text-lg font-semibold text-white">SPY ETF Hedging</h4>
                    </div>
                    <div className="bg-white/5 rounded-lg p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Action:</span>
                        <span className="font-bold text-coral-300">Short 42 shares</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Notional Value:</span>
                        <span className="font-bold text-white">$18,500</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Resulting Beta:</span>
                        <span className="font-bold text-grass-400">~0.00</span>
                      </div>
                    </div>
                  </div>

                  {/* ES Futures Method */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚡</span>
                      <h4 className="text-lg font-semibold text-white">ES Futures Hedging</h4>
                    </div>
                    <div className="bg-white/5 rounded-lg p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Action:</span>
                        <span className="font-bold text-coral-300">Short 7 contracts</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Notional Value:</span>
                        <span className="font-bold text-white">$17,850</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Resulting Beta:</span>
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
                    <h4 className="font-semibold text-white mb-2">Key Insights</h4>
                    <ul className="text-white/70 space-y-2 text-sm">
                      <li>✓ Your portfolio is currently <span className="text-white">25% more exposed</span> to market movements than the benchmark</li>
                      <li>✓ Hedging via SPY is more accessible for retail investors</li>
                      <li>✓ ES futures provide <span className="text-white">capital efficiency</span> for larger portfolios</li>
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
    <Suspense fallback={<div className="min-h-screen p-6 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <AnalysisResultContent />
    </Suspense>
  );
}
