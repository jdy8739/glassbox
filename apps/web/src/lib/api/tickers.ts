/**
 * Ticker API - Functions for searching and fetching ticker data
 */

import axiosClient from '../axios-client';

export interface TickerSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

export interface TickerQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
}

/**
 * Search for ticker symbols
 * @param query - Search query (ticker symbol or company name)
 * @returns List of matching tickers
 */
export const searchTickers = async (query: string) => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  return axiosClient.get<TickerSearchResult[]>('/ticker/search', {
    params: { q: query.trim() },
  });
};

/**
 * Get quote for a specific ticker
 * @param symbol - Ticker symbol
 * @returns Quote data
 */
export const getQuote = async (symbol: string) => {
  return axiosClient.get<TickerQuote>('/ticker/quote', {
    params: { symbol },
  });
};
