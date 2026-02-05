import { useState, useEffect } from 'react';
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

  const saveDraft = (items: PortfolioItem[], dateRange: { startDate: string; endDate: string }) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ items, dateRange }));
    } catch (error) {
      console.error('Failed to save portfolio draft:', error);
    }
  };

  const restoreDraft = (): PortfolioDraft | null => {
    try {
      const draft = sessionStorage.getItem(STORAGE_KEY);
      if (draft) {
        const data = JSON.parse(draft) as PortfolioDraft;
        // Validate structure
        if (data.items && Array.isArray(data.items) && data.dateRange) {
          sessionStorage.removeItem(STORAGE_KEY);
          return data;
        }
      }
    } catch (error) {
      console.error('Failed to restore portfolio draft:', error);
    }
    return null;
  };

  const clearDraft = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear portfolio draft:', error);
    }
  };

  return {
    saveDraft,
    restoreDraft,
    clearDraft,
    hasRestoredDraft,
    setHasRestoredDraft,
  };
}
