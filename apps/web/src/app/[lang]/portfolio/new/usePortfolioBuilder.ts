import { useQuery } from '@tanstack/react-query';
import { searchTickers } from '@/lib/api/tickers';
import type { PortfolioItem } from '@glassbox/types';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { usePortfolioStorage } from '@/hooks/usePortfolioStorage';

/**
 * Core portfolio builder hook
 * Handles CRUD operations for portfolio items and search functionality
 */
export function usePortfolioBuilder() {
  // Portfolio state
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  // Search state
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchInput = useDebounce(searchInput, 300);
  const [showDropdown, setShowDropdown] = useState(false);

  // Storage hook
  const { restoreDraft, saveDraft, hasRestoredDraft, setHasRestoredDraft } = usePortfolioStorage();

  // Restore portfolio from sessionStorage on mount
  // Guard against double-restore (React Strict Mode, hot reload)
  useEffect(() => {
    if (hasRestoredDraft) return; // Already restored, skip

    const draft = restoreDraft();
    if (draft) {
      setItems(draft.items);
      setDateRange(draft.dateRange);
      setHasRestoredDraft(true);
    }
  }, [restoreDraft, hasRestoredDraft, setHasRestoredDraft]);

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

  // CRUD Operations
  const addItem = (symbol: string) => {
    const upperSymbol = symbol.toUpperCase();
    if (symbol && !items.find((item) => item.symbol === upperSymbol)) {
      setItems([...items, { symbol: upperSymbol, quantity: 1 }]);
      setSearchInput('');
      setShowDropdown(false);
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

  return {
    // Portfolio state
    items,
    dateRange,
    setDateRange,

    // Search state
    searchInput,
    setSearchInput,
    searchResults: searchQuery.data || [],
    isSearching: searchQuery.isLoading,
    showDropdown,
    setShowDropdown,

    // CRUD operations
    addItem,
    loadTemplate,
    removeItem,
    updateQuantity,

    // Storage
    saveDraft: () => saveDraft(items, dateRange),
  };
}
