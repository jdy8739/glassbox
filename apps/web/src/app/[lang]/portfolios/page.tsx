'use client';

import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Package, Rocket, Search, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { PortfolioCard } from './components/PortfolioCard';
import { ErrorBoundary } from '@/components/error-boundary';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { getAllPortfolios, deletePortfolio } from '@/lib/api/portfolio';
import type { Portfolio } from '@glassbox/types';

const CHART_COLORS = [
  '#06b6d4', // Cyan 500
  '#f472b6', // Pink 400
  '#a78bfa', // Violet 400
  '#fbbf24', // Amber 400
  '#34d399', // Emerald 400
  '#60a5fa', // Blue 400
];

function LibraryErrorFallback() {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen px-6 py-8 flex items-center justify-center">
      <div className="glass-panel p-8 max-w-md w-full text-center space-y-6 border-orange-500/20 bg-orange-500/5">
        <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-black dark:text-white mb-2">
            {t('portfolio.library.error.title')}
          </h2>
          <p className="text-sm text-black/60 dark:text-white/60">
            {t('portfolio.library.error.description')}
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <span>{t('common.button.back-home')}</span>
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm font-medium shadow-lg shadow-orange-500/20"
          >
            <Rocket className="w-4 h-4" />
            {t('common.button.retry')}
          </button>
        </div>
      </div>
    </main>
  );
}

function PortfolioLibraryContent() {
  const { t } = useTranslation();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const data = await getAllPortfolios();
        setPortfolios(data);
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const handleDeleteClick = (portfolioId: string) => {
    setPortfolioToDelete(portfolioId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!portfolioToDelete) return;

    setDeleting(portfolioToDelete);
    try {
      await deletePortfolio(portfolioToDelete);
      setPortfolios(portfolios.filter(p => p.id !== portfolioToDelete));
      // Close dialog on success
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      // TODO: Replace alert with proper toast notification
      alert(t('portfolio.delete.failed'));
    } finally {
      setDeleting(null);
      setPortfolioToDelete(null);
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
              <span className="text-xs font-semibold text-black/70 dark:text-white/70">{t('portfolio.library.label')}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-black dark:text-white">
              {t('portfolio.library.title.part1')} <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">{t('portfolio.library.title.part2')}</span>
            </h1>
            <p className="text-lg text-black/60 dark:text-white/60 max-w-xl">
              {t('portfolio.library.description')}
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-auto relative group">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-pink-400 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
             <div className="relative flex items-center bg-white/80 dark:bg-black/80 rounded-xl px-4 py-3 min-w-[300px] border border-black/5 dark:border-white/10 shadow-sm">
               <Search className="w-5 h-5 text-black/40 dark:text-white/40 mr-3" />
               <input
                 type="text"
                 placeholder={t('portfolio.library.search')}
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
                {searchQuery ? t('portfolio.library.search.empty') : t('portfolio.library.empty.message')}
              </p>
              <p className="text-black/50 dark:text-white/50 max-w-sm mx-auto">
                {searchQuery
                  ? `${t('portfolio.library.search.no-results')} "${searchQuery}". ${t('portfolio.library.search.try-again')}`
                  : t('portfolio.library.empty.create')}
              </p>
            </div>
            {!searchQuery && (
              <a href="/portfolio/new" className="glass-button px-8 py-3">
                <Rocket className="w-5 h-5 mr-2" />
                {t('nav.analyze')}
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
                <h3 className="font-bold text-black dark:text-white">{t('portfolio.card.new')}</h3>
                <p className="text-xs text-black/50 dark:text-white/50 mt-1">{t('portfolio.card.new-description')}</p>
              </div>
            </a>

            {/* Portfolio Cards */}
            {filteredPortfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                onDelete={handleDeleteClick}
                isDeleting={deleting === portfolio.id}
                colors={CHART_COLORS}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          // Prevent closing dialog while deletion is in progress
          if (deleting === null) {
            setDeleteDialogOpen(false);
          }
        }}
        onConfirm={handleConfirmDelete}
        title={t('portfolio.delete.confirm-title')}
        message={t('portfolio.delete.confirm-message')}
        confirmText={t('portfolio.delete.confirm-button')}
        cancelText={t('common.button.cancel')}
        variant="danger"
        isLoading={deleting !== null}
      />
    </main>
  );
}

export default function PortfolioLibrary() {
  return (
    <ErrorBoundary fallback={<LibraryErrorFallback />}>
      <PortfolioLibraryContent />
    </ErrorBoundary>
  );
}