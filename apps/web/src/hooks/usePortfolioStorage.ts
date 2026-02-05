import { useState, useCallback } from 'react';
import type { PortfolioItem } from '@glassbox/types';

interface PortfolioDraft {
  items: PortfolioItem[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

const STORAGE_KEY = 'draft-portfolio';

/**
 * Hook for persisting portfolio drafts to sessionStorage
 * Automatically restores draft on mount and clears after restore
 */
export function usePortfolioStorage() {
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

  const saveDraft = useCallback((items: PortfolioItem[], dateRange: { startDate: string; endDate: string }) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ items, dateRange }));
    } catch (error) {
      console.error('Failed to save portfolio draft:', error);
    }
  }, []);

  const restoreDraft = useCallback((): PortfolioDraft | null => {
    try {
      const draft = sessionStorage.getItem(STORAGE_KEY);
      if (!draft) return null;

      const data = JSON.parse(draft) as PortfolioDraft;

      // Comprehensive validation
      const isValid =
        data &&
        typeof data === 'object' &&
        Array.isArray(data.items) &&
        data.dateRange &&
        typeof data.dateRange === 'object' &&
        typeof data.dateRange.startDate === 'string' &&
        typeof data.dateRange.endDate === 'string';

      if (isValid) {
        sessionStorage.removeItem(STORAGE_KEY);
        return data;
      }

      // Clear invalid data
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to restore portfolio draft:', error);
      // Clear corrupted data
      sessionStorage.removeItem(STORAGE_KEY);
    }
    return null;
  }, []);

  const clearDraft = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear portfolio draft:', error);
    }
  }, []);

  return {
    saveDraft,
    restoreDraft,
    clearDraft,
    hasRestoredDraft,
    setHasRestoredDraft,
  };
}
