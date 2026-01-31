import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalizedRouter } from '@/hooks/useLocalizedRouter';
import { analyzePortfolio } from '@/lib/api/portfolio';
import { searchTickers } from '@/lib/api/tickers';
import { saveAnalysisSession, clearAnalysisSession } from '@/lib/storage/analysis-session';
import type { PortfolioItem } from '@glassbox/types';
import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export function usePortfolioBuilder() {
  const router = useLocalizedRouter();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchInput = useDebounce(searchInput, 300);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

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

    // Prepare request data
    const tickers = items.map((item) => item.symbol);
    const quantities = items.map((item) => item.quantity);

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
  };
}
