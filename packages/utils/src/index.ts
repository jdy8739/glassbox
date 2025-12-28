/**
 * Shared utilities for Glassbox
 */

import type { PortfolioWeights, PortfolioItem, PortfolioStats } from '@glassbox/types';

/**
 * Validate portfolio items
 */
export function validatePortfolioItems(items: PortfolioItem[]): boolean {
  if (!Array.isArray(items) || items.length === 0) {
    return false;
  }

  return items.every(
    (item) => item.symbol && typeof item.symbol === 'string' && item.quantity > 0,
  );
}

/**
 * Format currency value
 */
export function formatCurrency(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format percentage value
 */
export function formatPercentage(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Annualize returns (convert daily to annual)
 */
export function annualizeReturns(dailyReturns: number): number {
  return dailyReturns * 252; // 252 trading days per year
}

/**
 * Annualize volatility (convert daily to annual)
 */
export function annualizeVolatility(dailyVolatility: number): number {
  return dailyVolatility * Math.sqrt(252);
}

/**
 * Calculate Sharpe ratio
 */
export function calculateSharpeRatio(
  annualReturn: number,
  annualVolatility: number,
  riskFreeRate: number,
): number {
  if (annualVolatility === 0) {
    return 0;
  }
  return (annualReturn - riskFreeRate) / annualVolatility;
}

/**
 * Normalize portfolio weights to sum to 1
 */
export function normalizeWeights(weights: PortfolioWeights): PortfolioWeights {
  const sum = Object.values(weights).reduce((acc, val) => acc + val, 0);
  if (sum === 0) {
    return weights;
  }
  const normalized: PortfolioWeights = {};
  Object.entries(weights).forEach(([symbol, weight]) => {
    normalized[symbol] = weight / sum;
  });
  return normalized;
}

/**
 * Calculate portfolio statistics summary
 */
export function summarizeStats(stats: PortfolioStats): string {
  return `Return: ${formatPercentage(stats.expectedReturn)} | Volatility: ${formatPercentage(stats.volatility)} | Sharpe: ${stats.sharpeRatio.toFixed(2)}`;
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

/**
 * Check if string is a valid stock ticker
 */
export function isValidTicker(ticker: string): boolean {
  // Basic validation: 1-5 alphanumeric characters
  return /^[A-Z0-9]{1,5}$/.test(ticker.toUpperCase());
}
