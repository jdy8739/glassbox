'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useFetchPortfolioData } from './useFetchPortfolioData';
import { EfficientFrontierChart } from './efficient-frontier-chart';
import { exportAsCSV, exportAsPDF } from '@/lib/export-utils';
import { RefreshCw, Download, BarChart3, FileText, Save, TrendingUp, Shield, Target, Zap, Lightbulb, Check } from 'lucide-react';

function AnalysisResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const portfolioId = searchParams.get('portfolioId');

  const [activeTab, setActiveTab] = useState<'frontier' | 'hedging'>('frontier');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [portfolioName, setPortfolioName] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  
  const { 
    portfolioData, 
    isLoading, 
    isError, 
    reanalyze, 
    isReanalyzing,
    savePortfolio,
    isSaving,
    updatePortfolio,
    isUpdating
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

  const handleSaveButton = () => {
    if (portfolioId && portfolioData?.savedPortfolio) {
      // Update existing portfolio
      updatePortfolio({
        id: portfolioId,
        data: {
          tickers: portfolioData.items.map(i => i.symbol),
          quantities: portfolioData.items.map(i => i.quantity),
          analysisSnapshot: portfolioData.analysis
        }
      });
    } else {
      // Open modal for new portfolio
      setPortfolioName('');
      setIsSaveModalOpen(true);
    }
  };

  const confirmSave = () => {
    if (!portfolioName.trim() || !portfolioData) return;

    savePortfolio({
      name: portfolioName,
      tickers: portfolioData.items.map(i => i.symbol),
      quantities: portfolioData.items.map(i => i.quantity),
      analysisSnapshot: portfolioData.analysis
    });
    setIsSaveModalOpen(false);
  };

  const handleExportCSV = () => {
    if (!portfolioData) return;
    exportAsCSV({
      portfolioName: savedPortfolio?.name,
      items: portfolioData.items,
      analysis: portfolioData.analysis,
      timestamp: new Date(),
    });
    setIsExportOpen(false);
  };

  const handleExportPDF = () => {
    if (!portfolioData) return;
    exportAsPDF({
      portfolioName: savedPortfolio?.name,
      items: portfolioData.items,
      analysis: portfolioData.analysis,
      timestamp: new Date(),
    });
    setIsExportOpen(false);
  };

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportOpen(false);
      }
    };

    if (isExportOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [isExportOpen]);

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
  const isProcessing = isSaving || isUpdating;

  const backLink = isSnapshot ? '/portfolios' : '/portfolio/new';

  return (
    <main className="min-h-screen p-6">
      {/* Navigation */}
      <nav className="glass-panel mx-auto max-w-6xl mb-8 flex items-center justify-between px-6 py-3 relative z-40 rounded-xl">
        <a href={backLink} className="text-sm font-semibold text-black/80 dark:text-white/80 hover:text-black dark:text-white transition-colors duration-200 flex items-center gap-2">
          <span>←</span>
          <span>Back</span>
        </a>
        <div className="flex gap-2">
          {isSnapshot && !isReanalyzing && (
            <button
              onClick={handleReanalyze}
              className="glass-button-secondary text-xs px-3 py-2 flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Re-analyze</span>
            </button>
          )}
          {/* Export Dropdown */}
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="glass-button-outline text-xs px-3 py-2 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            {isExportOpen && (
              <div className="absolute right-0 mt-1 w-40 rounded-lg bg-white dark:bg-gray-900 border border-white/20 shadow-lg z-10">
                <button
                  onClick={handleExportCSV}
                  className="w-full text-left px-4 py-2.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm text-black dark:text-white border-b border-white/10 first:rounded-t-lg flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Export as CSV</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="w-full text-left px-4 py-2.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm text-black dark:text-white last:rounded-b-lg flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export as PDF</span>
                </button>
              </div>
            )}
          </div>
          <button
            onClick={handleSaveButton}
            className="glass-button text-xs px-3 py-2 flex items-center gap-1.5"
            disabled={isReanalyzing || isProcessing}
          >
            {isProcessing ? (
               <>
                 <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                 <span>Saving...</span>
               </>
            ) : (
               <>
                 <Save className="w-4 h-4" />
                 <span>{isSnapshot ? 'Update' : 'Save'}</span>
               </>
            )}
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
              className={`px-6 py-4 font-semibold transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'frontier'
                  ? 'border-b-cyan-300 text-cyan-300'
                  : 'border-b-transparent text-black/50 dark:text-white/50 hover:text-black/70 dark:text-white/70'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Efficient Frontier</span>
            </button>
            <button
              onClick={() => setActiveTab('hedging')}
              className={`px-6 py-4 font-semibold transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'hedging'
                  ? 'border-b-slate-300 text-slate-300'
                  : 'border-b-transparent text-black/50 dark:text-white/50 hover:text-black/70 dark:text-white/70'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Beta Hedging</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'frontier' && (
            <div className="space-y-6 animate-fade-in">
              {/* Chart */}
              <div className="glass-card-gradient cyan-blue p-6 text-center">
                 <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                   <h2 className="text-lg font-semibold text-black dark:text-white text-left">Efficient Frontier</h2>

                   {/* Legend */}
                   <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm">
                     <div className="flex items-center gap-2">
                       <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                       <span className="text-black/70 dark:text-white/70">Efficient Frontier</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <span className="w-2.5 h-2.5 rounded-full bg-yellow-300"></span>
                       <span className="text-black/70 dark:text-white/70">Min Variance</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                       <span className="text-black/70 dark:text-white/70">Max Sharpe</span>
                     </div>
                   </div>
                 </div>

                 <EfficientFrontierChart data={analysisData} />
              </div>

              {/* Portfolio Metrics Grid */}
              {analysisData && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-black dark:text-white">Optimal Portfolios</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Global Minimum Variance */}
                    <div className="glass-card-gradient slate-glow group cursor-pointer transform transition-all hover:scale-105">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm text-black/60 dark:text-white/60 mb-2">Global Minimum Variance (GMV)</p>
                          <p className="text-3xl font-bold text-black dark:text-white">
                            {(analysisData.gmv.stats.return * 100).toFixed(1)}%
                          </p>
                          <p className="text-xs text-black/50 dark:text-white/50 mt-1">Expected Annual Return</p>
                        </div>
                        <Target className="w-8 h-8 text-cyan-400" />
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
                    <div className="glass-card-gradient coral-pink group cursor-pointer transform transition-all hover:scale-105">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm text-black/60 dark:text-white/60 mb-2">Maximum Sharpe Ratio</p>
                          <p className="text-3xl font-bold text-black dark:text-white">
                            {(analysisData.maxSharpe.stats.return * 100).toFixed(1)}%
                          </p>
                          <p className="text-xs text-black/50 dark:text-white/50 mt-1">Expected Annual Return</p>
                        </div>
                        <Zap className="w-8 h-8 text-coral-300" />
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
                  <div className="glass-card p-6 space-y-3">
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
                          <span className="text-cyan-400 font-bold">{((weight as number) * 100).toFixed(1)}%</span>
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
                <div className="glass-card-gradient cyan-blue group cursor-pointer transform transition-all hover:scale-105">
                  <div className="mb-4"><BarChart3 className="w-8 h-8 text-cyan-400" /></div>
                  <p className="text-sm text-black/60 dark:text-white/60 mb-2">Current Portfolio Beta</p>
                  <p className="text-4xl font-bold text-black dark:text-white">
                    {analysisData.portfolioBeta.toFixed(2)}
                  </p>
                  <p className="text-xs text-black/50 dark:text-white/50 mt-2">Market Exposure</p>
                </div>

                {/* Target Beta */}
                <div className="glass-card-gradient cyan-blue group cursor-pointer transform transition-all hover:scale-105">
                  <div className="mb-4"><Target className="w-8 h-8 text-cyan-400" /></div>
                  <p className="text-sm text-black/60 dark:text-white/60 mb-2">Target Beta</p>
                  <p className="text-4xl font-bold text-black dark:text-white">0.00</p>
                  <p className="text-xs text-black/50 dark:text-white/50 mt-2">Market Neutral</p>
                </div>

                {/* Required Hedge */}
                <div className="glass-card-gradient slate-glow group cursor-pointer transform transition-all hover:scale-105">
                  <div className="mb-4"><Shield className="w-8 h-8 text-slate-400" /></div>
                  <p className="text-sm text-black/60 dark:text-white/60 mb-2">Hedge Required</p>
                  <p className="text-4xl font-bold text-black dark:text-white">
                    {(analysisData.portfolioBeta).toFixed(2)}
                  </p>
                  <p className="text-xs text-black/50 dark:text-white/50 mt-2">Beta Reduction Needed</p>
                </div>
              </div>

              {/* Hedging Recommendation */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-black dark:text-white">Hedging Strategy</h3>
                <div className="glass-card space-y-6">
                  {/* SPY Method */}
                  <div className="space-y-4 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-cyan-400" />
                      <h4 className="text-lg font-semibold text-black dark:text-white">SPY ETF Hedging</h4>
                    </div>
                    <div className="bg-black/5 dark:bg-white/5 rounded-lg p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-black/70 dark:text-white/70">Action:</span>
                        <span className="font-bold text-coral-300">
                          Short {Math.abs(analysisData.hedging.spyShares).toLocaleString()} shares
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
                        <span className="font-bold text-cyan-400">~0.00</span>
                      </div>
                    </div>
                  </div>

                  {/* ES Futures Method */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Zap className="w-6 h-6 text-slate-400" />
                      <h4 className="text-lg font-semibold text-black dark:text-white">ES Futures Hedging</h4>
                    </div>
                    <div className="bg-black/5 dark:bg-white/5 rounded-lg p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-black/70 dark:text-white/70">Action:</span>
                        <span className="font-bold text-slate-300">
                          Short {Math.abs(analysisData.hedging.esContracts).toLocaleString()} contracts
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
                        <span className="font-bold text-cyan-400">~0.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Insights */}
              <div className="glass-card-gradient coral-pink space-y-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-coral-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-black dark:text-white mb-2">Key Insights</h4>
                    <ul className="text-black/70 dark:text-white/70 space-y-2 text-sm">
                      <li className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>
                          Your portfolio has a beta of{' '}
                          <span className="text-black dark:text-white">{analysisData.portfolioBeta.toFixed(2)}</span>
                          {analysisData.portfolioBeta > 1 && `, meaning it's ${((analysisData.portfolioBeta - 1) * 100).toFixed(0)}% more volatile than the market`}
                          {analysisData.portfolioBeta < 1 && `, meaning it's ${((1 - analysisData.portfolioBeta) * 100).toFixed(0)}% less volatile than the market`}
                          {analysisData.portfolioBeta === 1 && ', meaning it moves in line with the market'}
                        </span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>Hedging via SPY is more accessible for retail investors</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>ES futures provide <span className="text-black dark:text-white">capital efficiency</span> for larger portfolios</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 border border-white/10">
            <h3 className="text-xl font-bold text-black dark:text-white">Save Portfolio</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-black/70 dark:text-white/70">Portfolio Name</label>
              <input
                type="text"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                placeholder="e.g., My Tech Portfolio"
                className="glass-input w-full"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="px-4 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSave}
                disabled={!portfolioName.trim()}
                className="glass-button px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
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