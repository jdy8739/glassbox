/**
 * Portfolio Analysis API Service
 * Handles communication with the backend for portfolio optimization
 */

import axios from 'axios';
import type { Portfolio, AnalysisSnapshot } from '@glassbox/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface AnalyzePortfolioRequest {
  tickers: string[];
  quantities: number[];
  portfolioValue?: number;
  targetBeta?: number;
  startDate?: string;
  endDate?: string;
}

export interface CreatePortfolioRequest {
  name: string;
  tickers: string[];
  quantities: number[];
  analysisSnapshot: AnalysisSnapshot;
}

export interface UpdatePortfolioRequest {
  name?: string;
  tickers?: string[];
  quantities?: number[];
  analysisSnapshot?: AnalysisSnapshot;
}

export interface PortfolioStats {
  return: number;
  volatility: number;
  sharpe: number;
}

export interface OptimalPortfolio {
  weights: Record<string, number>;
  stats: PortfolioStats;
}

export interface FrontierPoint {
  return: number;
  volatility: number;
  sharpeRatio: number;
}

export interface HedgingRecommendation {
  spyShares: number;
  spyNotional: number;
  esContracts: number;
  esNotional: number;
}

export interface AnalyzePortfolioResponse {
  gmv: OptimalPortfolio;
  maxSharpe: OptimalPortfolio;
  efficientFrontier: FrontierPoint[];
  randomPortfolios?: FrontierPoint[];
  portfolioBeta: number;
  hedging: HedgingRecommendation;
  riskFreeRate: number;
  analysisDate?: string;
  analysisEndDate?: string;
}

/**
 * Analyze portfolio and calculate efficient frontier
 */
export async function analyzePortfolio(
  request: AnalyzePortfolioRequest,
): Promise<AnalyzePortfolioResponse> {
  try {
    const { data } = await axios.post<AnalyzePortfolioResponse>(
      `${API_BASE_URL}/portfolio/analyze`,
      request
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to analyze portfolio');
    }
    throw error;
  }
}

/**
 * Get all portfolios
 */
export const getAllPortfolios = async (): Promise<Portfolio[]> => {
  // Using localStorage for demo
  const { getAllPortfolios: getAll } = await import('@/lib/storage/portfolio-storage');
  return getAll();
};

/**
 * Create a new portfolio
 */
export const savePortfolio = async (request: CreatePortfolioRequest): Promise<Portfolio> => {
  // Using localStorage for demo
  const { createPortfolio } = await import('@/lib/storage/portfolio-storage');
  return createPortfolio(request);

  // Real API implementation (commented out for demo):
  // const { data } = await axios.post<Portfolio>(`${API_BASE_URL}/portfolios`, request);
  // return data;
};

/**
 * Update an existing portfolio
 */
export const updatePortfolio = async (id: string, request: UpdatePortfolioRequest): Promise<Portfolio> => {
  // Using localStorage for demo
  const { updatePortfolio: update } = await import('@/lib/storage/portfolio-storage');
  return update(id, request);

  // Real API implementation (commented out for demo):
  // const { data } = await axios.put<Portfolio>(`${API_BASE_URL}/portfolios/${id}`, request);
  // return data;
};

/**
 * Get a portfolio by ID
 */
export const getPortfolio = async (id: string): Promise<Portfolio> => {
  // Using localStorage for demo
  const { getPortfolioById } = await import('@/lib/storage/portfolio-storage');
  const portfolio = getPortfolioById(id);

  if (!portfolio) {
    throw new Error('Portfolio not found');
  }

  return portfolio;

  // Real API implementation (commented out for demo):
  // const { data } = await axios.get<Portfolio>(`${API_BASE_URL}/portfolios/${id}`);
  // return data;
};

/**
 * Delete a portfolio by ID
 */
export const deletePortfolio = async (id: string): Promise<void> => {
  // Using localStorage for demo
  const { deletePortfolio: remove } = await import('@/lib/storage/portfolio-storage');
  remove(id);

  // Real API implementation (commented out for demo):
  // await axios.delete(`${API_BASE_URL}/portfolios/${id}`);
};

/**
 * Check if backend and Python environment are healthy
 */
export async function checkPortfolioHealth(): Promise<{
  status: string;
  pythonAvailable: boolean;
}> {
  const { data } = await axios.get<{ status: string; pythonAvailable: boolean }>(
    `${API_BASE_URL}/portfolio/health`
  );
  return data;
}
