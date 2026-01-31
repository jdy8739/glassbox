import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalizedRouter } from '@/hooks/useLocalizedRouter';
import { useTranslation } from 'react-i18next';
import { analyzePortfolio } from '@/lib/api/portfolio';
import { searchTickers } from '@/lib/api/tickers';
import { saveAnalysisSession, clearAnalysisSession } from '@/lib/storage/analysis-session';
import type { PortfolioItem } from '@glassbox/types';
import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export function usePortfolioBuilder() {
  const { t } = useTranslation();
  const router = useLocalizedRouter();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchInput = useDebounce(searchInput, 300);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [showTodayWarning, setShowTodayWarning] = useState(false);
  const [pendingAnalysis, setPendingAnalysis] = useState<{
    tickers: string[];
    quantities: number[];
    portfolioValue: number;
    targetBeta: number;
    startDate?: string;
    endDate?: string;
  } | null>(null);

  // Query for searching tickers
  const searchQuery = useQuery({
    queryKey: ['searchTickers', debouncedSearchInput],
    queryFn: async () => {
      if (debouncedSearchInput.trim().length < 1) return [];
      return searchTickers(debouncedSearchInput);
    },
    enabled: debouncedSearchInput.trim().length >= 1,
    staleTime: 60 * 1000, // 1 minute cache for searches
  });

  // Mutation for analyzing portfolio
  const analyzeMutation = useMutation({
    mutationFn: analyzePortfolio,
    onSuccess: (result) => {
      // Clear old session and save new analysis
      clearAnalysisSession();
      saveAnalysisSession(result, items);

      // Invalidate the portfolio query cache to force fresh data
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });

      // Navigate to results page
      router.push('/analysis/result');
    },
  });

  const addItem = (symbol: string, name?: string) => {
    const upperSymbol = symbol.toUpperCase();
    if (symbol && !items.find((item) => item.symbol === upperSymbol)) {
      setItems([...items, { symbol: upperSymbol, quantity: 1 }]);
      setSearchInput('');
      setShowDropdown(false);
      
      // Smooth scroll happens in UI
      return true; 
    }
    return false;
  };

  const loadTemplate = (templateItems: { symbol: string; quantity: number }[]) => {
    setItems(templateItems);
  };

  const removeItem = (symbol: string) => {
    setItems(items.filter((item) => item.symbol !== symbol));
  };

  const updateQuantity = (symbol: string, quantity: number) => {
    setItems(
      items.map((item) => (item.symbol === symbol ? { ...item, quantity } : item)),
    );
  };

  const handleAnalyze = () => {
    if (items.length === 0) return;

    // Filter out zero quantities
    const nonZeroItems = items.filter((item) => item.quantity > 0);

    if (nonZeroItems.length === 0) {
      window.alert(t('portfolio.builder.validation.no-positive-quantity'));
      return;
    }

    // Validate date range
    if (dateRange.startDate && dateRange.endDate && dateRange.startDate >= dateRange.endDate) {
      window.alert(t('portfolio.builder.validation.start-before-end'));
      return;
    }

    // Check for future dates
    if (dateRange.endDate) {
      const endDate = new Date(dateRange.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time for fair comparison

      if (endDate > today) {
        window.alert(t('portfolio.builder.validation.end-not-future'));
        return;
      }

      // Warn if end date is today (market may not be closed)
      if (endDate.getTime() === today.getTime()) {
        // Show confirmation dialog and store pending analysis
        const tickers = nonZeroItems.map((item) => item.symbol);
        const quantities = nonZeroItems.map((item) => item.quantity);
        const portfolioValue = 100000; // Default $100k portfolio

        setPendingAnalysis({
          tickers,
          quantities,
          portfolioValue,
          targetBeta: 0,
          startDate: dateRange.startDate || undefined,
          endDate: dateRange.endDate || undefined,
        });
        setShowTodayWarning(true);
        return;
      }
    }

    if (dateRange.startDate) {
      const startDate = new Date(dateRange.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate > today) {
        window.alert(t('portfolio.builder.validation.start-not-future'));
        return;
      }
    }

    // Check for minimum date range (45 days for ~30 trading days)
    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      const daysDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

      if (daysDiff < 45) {
        window.alert(t('portfolio.builder.validation.date-range-minimum'));
        return;
      }
    }

    // Prepare request data (use only non-zero items)
    const tickers = nonZeroItems.map((item) => item.symbol);
    const quantities = nonZeroItems.map((item) => item.quantity);

    // Calculate portfolio value from quantities (assume average price)
    const portfolioValue = 100000; // Default $100k portfolio

    analyzeMutation.mutate({
      tickers,
      quantities,
      portfolioValue,
      targetBeta: 0, // Market-neutral by default
      startDate: dateRange.startDate || undefined,
      endDate: dateRange.endDate || undefined,
    });
  };

  const handleConfirmTodayWarning = () => {
    if (pendingAnalysis) {
      analyzeMutation.mutate(pendingAnalysis);
      setPendingAnalysis(null);
    }
  };

  return {
    items,
    searchInput,
    setSearchInput,
    searchResults: searchQuery.data || [],
    isSearching: searchQuery.isLoading,
    isAnalyzing: analyzeMutation.isPending,
    analysisError: analyzeMutation.error ? (analyzeMutation.error as Error).message : null,
    showDropdown,
    setShowDropdown,
    addItem,
    loadTemplate,
    removeItem,
    updateQuantity,
    handleAnalyze,
    clearError: analyzeMutation.reset,
    dateRange,
    setDateRange,
    showTodayWarning,
    setShowTodayWarning,
    handleConfirmTodayWarning,
  };
}
