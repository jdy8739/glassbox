import { useQuery } from '@tanstack/react-query';
import { useLocalizedRouter } from '@/hooks/useLocalizedRouter';
import { useTranslation } from 'react-i18next';
import { searchTickers } from '@/lib/api/tickers';
import type { PortfolioItem } from '@glassbox/types';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export function usePortfolioBuilder() {
  const { t } = useTranslation();
  const router = useLocalizedRouter();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchInput = useDebounce(searchInput, 300);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [showTodayWarning, setShowTodayWarning] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

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

  const navigateToResults = () => {
    const nonZeroItems = items.filter(item => item.quantity > 0);
    const params = new URLSearchParams({
      tickers: nonZeroItems.map(item => item.symbol).join(','),
      quantities: nonZeroItems.map(item => item.quantity).join(','),
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });
    router.push(`/analysis/result?${params}`);
  };

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

  const validateAnalysis = (): string | null => {
    // Filter out zero quantities
    const nonZeroItems = items.filter((item) => item.quantity > 0);

    if (nonZeroItems.length === 0) {
      return t('portfolio.builder.validation.no-positive-quantity');
    }

    // Check if dates are missing
    if (!dateRange.startDate || !dateRange.endDate) {
      return t('portfolio.builder.analysis.dates-required');
    }

    // Validate date range order
    if (dateRange.startDate >= dateRange.endDate) {
      return t('portfolio.builder.validation.start-before-end');
    }

    // Check for future dates
    const endDate = new Date(dateRange.endDate);
    const startDate = new Date(dateRange.startDate);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    if (endDate > todayDate) {
      return t('portfolio.builder.validation.end-not-future');
    }

    if (startDate > todayDate) {
      return t('portfolio.builder.validation.start-not-future');
    }

    // Check for minimum date range (45 days)
    const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff < 45) {
      return t('portfolio.builder.validation.date-range-minimum');
    }

    return null; // No errors
  };

  const handleAnalyze = () => {
    if (items.length === 0) return;

    // Validate inputs - will be displayed near button
    const error = validateAnalysis();
    if (error) return;

    const nonZeroItems = items.filter((item) => item.quantity > 0);

    // Check if end date is today (show confirmation dialog)
    const endDate = new Date(dateRange.endDate);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    if (endDate.getTime() === todayDate.getTime()) {
      setShowTodayWarning(true);
      return;
    }

    // Navigate to results page
    navigateToResults();
  };

  const handleConfirmTodayWarning = () => {
    setShowTodayWarning(false);
    navigateToResults();
  };

  // Update validation error whenever inputs change
  useEffect(() => {
    setValidationError(validateAnalysis());
  }, [items, dateRange.startDate, dateRange.endDate]);

  return {
    items,
    searchInput,
    setSearchInput,
    searchResults: searchQuery.data || [],
    isSearching: searchQuery.isLoading,
    validationError,
    showDropdown,
    setShowDropdown,
    addItem,
    loadTemplate,
    removeItem,
    updateQuantity,
    handleAnalyze,
    dateRange,
    setDateRange,
    showTodayWarning,
    setShowTodayWarning,
    handleConfirmTodayWarning,
  };
}
