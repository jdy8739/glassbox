import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { analyzePortfolio } from '@/lib/api/portfolio';
import { searchTickers } from '@/lib/api/tickers';
import type { TickerSearchResult } from '@/lib/api/tickers';
import type { PortfolioItem } from '@glassbox/types';
import { useState } from 'react';

export function usePortfolioBuilder() {
  const router = useRouter();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Query for searching tickers
  const searchQuery = useQuery({
    queryKey: ['searchTickers', searchInput],
    queryFn: async () => {
      if (searchInput.trim().length < 1) return [];
      return searchTickers(searchInput);
    },
    enabled: searchInput.trim().length >= 1,
    staleTime: 60 * 1000, // 1 minute cache for searches
  });

  // Mutation for analyzing portfolio
  const analyzeMutation = useMutation({
    mutationFn: analyzePortfolio,
    onSuccess: (result) => {
      // Store results in sessionStorage
      sessionStorage.setItem('portfolioAnalysisResult', JSON.stringify(result));
      sessionStorage.setItem('portfolioItems', JSON.stringify(items));
      
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
    removeItem,
    updateQuantity,
    handleAnalyze,
    clearError: analyzeMutation.reset,
  };
}
