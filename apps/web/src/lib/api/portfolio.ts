/**
 * Portfolio Analysis API Service
 * Handles communication with the backend for portfolio optimization
 */

import axiosClient from '@/lib/axios-client';
import type { Portfolio, AnalysisSnapshot } from '@glassbox/types';

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
  return axiosClient.post('/portfolio/analyze', request) as Promise<AnalyzePortfolioResponse>;
}

/**
 * Get all portfolios
 */
export const getAllPortfolios = async (): Promise<Portfolio[]> => {
  return axiosClient.get('/portfolio') as Promise<Portfolio[]>;
};

/**
 * Create a new portfolio
 */
export const savePortfolio = async (request: CreatePortfolioRequest): Promise<Portfolio> => {
  return axiosClient.post('/portfolio', request) as Promise<Portfolio>;
};

/**
 * Update an existing portfolio
 */
export const updatePortfolio = async (id: string, request: UpdatePortfolioRequest): Promise<Portfolio> => {
  return axiosClient.put(`/portfolio/${id}`, request) as Promise<Portfolio>;
};

/**
 * Get a portfolio by ID
 */
export const getPortfolio = async (id: string): Promise<Portfolio> => {
  return axiosClient.get(`/portfolio/${id}`) as Promise<Portfolio>;
};

/**
 * Delete a portfolio by ID
 */
export const deletePortfolio = async (id: string): Promise<void> => {
  return axiosClient.delete(`/portfolio/${id}`) as Promise<void>;
};

/**
 * Check if backend and Python environment are healthy
 */
export async function checkPortfolioHealth(): Promise<{
  status: string;
  pythonAvailable: boolean;
}> {
  return axiosClient.get('/portfolio/health');
}