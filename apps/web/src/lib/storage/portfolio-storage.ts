/**
 * Portfolio LocalStorage Service
 * Handles CRUD operations for portfolios in localStorage
 * Can be easily swapped for real API calls later
 */

import type { Portfolio, AnalysisSnapshot } from '@glassbox/types';

const STORAGE_KEY = 'glassbox_portfolios';

/**
 * Generate a simple UUID v4
 */
const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Get all portfolios from localStorage
 */
export const getAllPortfolios = (): Portfolio[] => {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const portfolios = JSON.parse(data) as Portfolio[];
    // Convert date strings back to Date objects
    return portfolios.map(p => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }));
  } catch (error) {
    console.error('Error reading portfolios from localStorage:', error);
    return [];
  }
};

/**
 * Get a single portfolio by ID
 */
export const getPortfolioById = (id: string): Portfolio | null => {
  const portfolios = getAllPortfolios();
  return portfolios.find(p => p.id === id) || null;
};

/**
 * Save all portfolios to localStorage
 */
const saveAllPortfolios = (portfolios: Portfolio[]): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolios));
  } catch (error) {
    console.error('Error saving portfolios to localStorage:', error);
    throw new Error('Failed to save portfolio');
  }
};

/**
 * Create a new portfolio
 */
export const createPortfolio = (data: {
  name: string;
  tickers: string[];
  quantities: number[];
  analysisSnapshot: AnalysisSnapshot;
}): Portfolio => {
  const portfolios = getAllPortfolios();

  const newPortfolio: Portfolio = {
    id: generateId(),
    userId: 'local-user', // Demo user ID
    name: data.name,
    tickers: data.tickers,
    quantities: data.quantities,
    analysisSnapshot: data.analysisSnapshot,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  portfolios.push(newPortfolio);
  saveAllPortfolios(portfolios);

  return newPortfolio;
};

/**
 * Update an existing portfolio
 */
export const updatePortfolio = (
  id: string,
  data: {
    name?: string;
    tickers?: string[];
    quantities?: number[];
    analysisSnapshot?: AnalysisSnapshot;
  }
): Portfolio => {
  const portfolios = getAllPortfolios();
  const index = portfolios.findIndex(p => p.id === id);

  if (index === -1) {
    throw new Error('Portfolio not found');
  }

  const updated: Portfolio = {
    ...portfolios[index],
    ...data,
    updatedAt: new Date(),
  };

  portfolios[index] = updated;
  saveAllPortfolios(portfolios);

  return updated;
};

/**
 * Delete a portfolio
 */
export const deletePortfolio = (id: string): void => {
  const portfolios = getAllPortfolios();
  const filtered = portfolios.filter(p => p.id !== id);

  if (filtered.length === portfolios.length) {
    throw new Error('Portfolio not found');
  }

  saveAllPortfolios(filtered);
};

/**
 * Clear all portfolios (useful for testing/reset)
 */
export const clearAllPortfolios = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};
