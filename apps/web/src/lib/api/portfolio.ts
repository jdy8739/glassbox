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
export const analyzePortfolio = async (
  request: AnalyzePortfolioRequest,
) => {
  return axiosClient.post<AnalysisSnapshot>('/portfolio/analyze', request);
};

/**
 * Get all portfolios
 */
export const getAllPortfolios = async () => {
  return axiosClient.get<Portfolio[]>('/portfolio');
};

/**
 * Create a new portfolio
 */
export const savePortfolio = async (request: CreatePortfolioRequest) => {
  return axiosClient.post<void>('/portfolio', request);
};

/**
 * Update an existing portfolio
 */
export const updatePortfolio = async (id: string, request: UpdatePortfolioRequest) => {
  return axiosClient.put<void>(`/portfolio/${id}`, request);
};

/**
 * Get a portfolio by ID
 */
export const getPortfolio = async (id: string) => {
  return axiosClient.get<Portfolio>(`/portfolio/${id}`);
};

/**
 * Delete a portfolio by ID
 */
export const deletePortfolio = async (id: string) => {
  return axiosClient.delete<void>(`/portfolio/${id}`);
};