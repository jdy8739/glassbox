'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useFetchPortfolioData } from './useFetchPortfolioData';
import { exportAsCSV, exportAsPDF } from '@/lib/export-utils';
import { RefreshCw, Download, BarChart3, FileText, Save, TrendingUp, Shield, Target, Zap, Lightbulb, Check } from 'lucide-react';
import { KeyMetrics } from './components/KeyMetrics';
import { HedgingComparison } from './components/HedgingComparison';
import { HeaderPortal } from '@/lib/header-context';

const EfficientFrontierChart = dynamic(
  () => import('./efficient-frontier-chart').then((mod) => mod.EfficientFrontierChart),
  { 
    loading: () => (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center gap-3 text-black/40 dark:text-white/40">
        <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Loading Chart...</span>
      </div>
    ),
    ssr: false 
  }
);

const MarketScenarioSimulator = dynamic(
  () => import('./components/MarketScenarioSimulator').then((mod) => mod.MarketScenarioSimulator),
  {
    loading: () => (
      <div className="w-full h-[300px] flex flex-col items-center justify-center gap-3 text-black/40 dark:text-white/40 glass-panel">
        <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-medium">Loading Simulator...</span>
      </div>
    ),
    ssr: false
  }
);

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
      <main className="min-h-screen px-6 py-8 flex items-center justify-center">
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
    <main className="min-h-screen px-6 py-8">
      <HeaderPortal
        nav={
          <a href={backLink} className="text-sm font-semibold text-black/80 dark:text-white/80 hover:text-black dark:text-white transition-colors duration-200 flex items-center gap-2">
            <span>←</span>
            <span>Back</span>
          </a>
        }
        actions={
          <div className="flex gap-2 items-center">
            {isSnapshot && !isReanalyzing && (
              <button
                onClick={handleReanalyze}
                className="h-9 px-3 flex items-center gap-2 rounded-lg text-xs font-medium text-slate-700 dark:text-white/80 bg-white/10 dark:bg-slate-800/50 border border-black/5 dark:border-white/10 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Re-analyze</span>
              </button>
            )}
            {/* Export Dropdown */}
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="h-9 px-3 flex items-center gap-2 rounded-lg text-xs font-medium text-slate-700 dark:text-white/80 bg-white/10 dark:bg-slate-800/50 border border-black/5 dark:border-white/10 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
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
              className="h-9 px-3 flex items-center gap-2 rounded-lg text-xs font-medium text-slate-700 dark:text-white/80 bg-white/10 dark:bg-slate-800/50 border border-black/5 dark:border-white/10 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isReanalyzing || isProcessing}
            >
              {isProcessing ? (
                 <>
                   <div className="w-3 h-3 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
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
        }
      />

      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-black/70 dark:text-white/70">Analysis Complete</span>
            </div>
            
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-2">
                Portfolio Analysis
              </h1>
              <p className="text-lg text-black/60 dark:text-white/60 max-w-2xl">
                {isSnapshot
                  ? `Viewing saved snapshot: ${savedPortfolio?.name}`
                  : `Optimized allocation for ${portfolioItems.length} assets based on historical data.`}
              </p>
            </div>
          </div>
        </div>

        {/* Top Level Key Metrics */}
        {analysisData && (
          <KeyMetrics 
            stats={{
              maxSharpe: analysisData.maxSharpe.stats,
              gmv: analysisData.gmv.stats,
              beta: analysisData.portfolioBeta
            }} 
          />
        )}

        {/* Main Content Tabs */}
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="border-b border-black/10 dark:border-white/10">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('frontier')}
                className={`pb-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 'frontier'
                    ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                    : 'border-transparent text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Efficient Frontier</span>
              </button>
              <button
                onClick={() => setActiveTab('hedging')}
                className={`pb-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 'hedging'
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Beta Hedging</span>
              </button>
            </div>
          </div>

          {/* Tab Panels */}
          <div className="animate-fade-in">
            {activeTab === 'frontier' && analysisData && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 glass-panel p-6 min-h-[500px] flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-black dark:text-white">Risk vs. Return Profile</h3>
                    
                    {/* Legend */}
                    <div className="flex gap-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                        <span className="opacity-70">Optimal Line</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-400"></span>
                        <span className="opacity-70">Max Sharpe</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 -ml-4">
                     <EfficientFrontierChart data={analysisData} />
                  </div>
                </div>

                {/* Optimal Weights Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="glass-panel p-6">
                    <h3 className="font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      Optimal Allocation
                    </h3>
                    <p className="text-xs text-black/50 dark:text-white/50 mb-4">
                      Suggested weights to maximize Sharpe ratio (Risk-adjusted return).
                    </p>
                    
                    <div className="space-y-3">
                      {Object.entries(analysisData.maxSharpe.weights)
                        .filter(([_, weight]) => (weight as number) > 0.001)
                        .sort((a, b) => (b[1] as number) - (a[1] as number))
                        .map(([ticker, weight]) => (
                          <div key={ticker} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center font-bold text-xs">
                                {ticker[0]}
                              </div>
                              <span className="font-medium text-sm">{ticker}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-cyan-600 dark:text-cyan-400">
                                {((weight as number) * 100).toFixed(1)}%
                              </span>
                              <div className="h-1 w-16 bg-black/5 dark:bg-white/5 rounded-full mt-1 overflow-hidden">
                                <div 
                                  className="h-full bg-cyan-500" 
                                  style={{ width: `${(weight as number) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Additional Stats */}
                  <div className="glass-panel p-6 space-y-4">
                    <h3 className="font-bold text-black dark:text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-pink-500" />
                      Risk Profile
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                        <span className="text-black/60 dark:text-white/60">Risk-Free Rate Used</span>
                        <span className="font-mono text-black dark:text-white">{(analysisData.riskFreeRate * 100).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                         <span className="text-black/60 dark:text-white/60">Sharpe Rating</span>
                         <span className={`font-bold ${analysisData.maxSharpe.stats.sharpe > 1 ? 'text-emerald-500' : 'text-yellow-500'}`}>
                           {analysisData.maxSharpe.stats.sharpe > 1 ? 'Excellent' : analysisData.maxSharpe.stats.sharpe > 0.5 ? 'Good' : 'Fair'}
                         </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hedging' && analysisData && (
              <div className="space-y-8">
                 <HedgingComparison 
                   data={{
                     spy: analysisData.hedging.spy,
                     es: analysisData.hedging.es,
                     beta: analysisData.portfolioBeta
                   }}
                 />
                 
                 {/* Market Simulation */}
                 <MarketScenarioSimulator beta={analysisData.portfolioBeta} />

                 {/* Hedge Explanation */}
                 <div className="glass-panel p-6 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border-dashed">
                    <h4 className="font-bold text-black dark:text-white mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      How this works
                    </h4>
                    <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed max-w-3xl">
                      Since your portfolio has a Beta of <strong>{analysisData.portfolioBeta.toFixed(2)}</strong>, it is theoretically {((Math.abs(1 - analysisData.portfolioBeta)) * 100).toFixed(0)}% {analysisData.portfolioBeta > 1 ? 'more' : 'less'} volatile than the market. 
                      To make your portfolio "Market Neutral" (Beta ≈ 0), you need to short sell an equivalent amount of market exposure. 
                      This protects you from systematic market crashes while allowing you to profit from the individual performance (Alpha) of your chosen stocks.
                    </p>
                 </div>
              </div>
            )}
          </div>
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
    <Suspense fallback={<div className="min-h-screen px-6 py-8 flex items-center justify-center"><div className="text-black dark:text-white">Loading...</div></div>}>
      <AnalysisResultContent />
    </Suspense>
  );
}