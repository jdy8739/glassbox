/**
 * Analysis Session Storage Utility
 * Handles temporary storage of portfolio analysis results
 *
 * TODO: This file will be removed when server-side storage is implemented
 * Currently using sessionStorage as a temporary solution
 */

import type { AnalysisSnapshot, PortfolioItem } from '@glassbox/types';

const KEYS = {
  ANALYSIS: 'portfolioAnalysisResult',
  ITEMS: 'portfolioItems',
} as const;

/**
 * Save analysis result and items to sessionStorage
 */
export const saveAnalysisSession = (analysis: AnalysisSnapshot, items: PortfolioItem[]): void => {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(KEYS.ANALYSIS, JSON.stringify(analysis));
    sessionStorage.setItem(KEYS.ITEMS, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save analysis to sessionStorage:', error);
  }
};

/**
 * Load analysis result and items from sessionStorage
 */
export const loadAnalysisSession = (): { analysis: AnalysisSnapshot; items: PortfolioItem[] } | null => {
  if (typeof window === 'undefined') return null;

  try {
    const analysisData = sessionStorage.getItem(KEYS.ANALYSIS);
    const itemsData = sessionStorage.getItem(KEYS.ITEMS);

    if (!analysisData || !itemsData) return null;

    return {
      analysis: JSON.parse(analysisData),
      items: JSON.parse(itemsData),
    };
  } catch (error) {
    console.error('Failed to load analysis from sessionStorage:', error);
    return null;
  }
};

/**
 * Clear analysis data from sessionStorage
 */
export const clearAnalysisSession = (): void => {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(KEYS.ANALYSIS);
    sessionStorage.removeItem(KEYS.ITEMS);
  } catch (error) {
    console.error('Failed to clear analysis from sessionStorage:', error);
  }
};
