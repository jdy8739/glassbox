/**
 * Ticker API - Functions for searching and fetching ticker data
 */

import { get } from '../api-client';

export interface TickerSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

/**
 * Search for ticker symbols
 * @param query - Search query (ticker symbol or company name)
 * @returns List of matching tickers
 */
export async function searchTickers(query: string): Promise<TickerSearchResult[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  return get<TickerSearchResult[]>('/tickers/search', {
    params: { q: query.trim() },
  });
}

/**
 * Get quote for a specific ticker
 * @param symbol - Ticker symbol
 * @returns Quote data
 */
export async function getQuote(symbol: string): Promise<any> {
  return get<any>('/tickers/quote', {
    params: { symbol },
  });
}
