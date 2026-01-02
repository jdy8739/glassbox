/**
 * Portfolio Analysis API Service
 * Handles communication with the backend for portfolio optimization
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface AnalyzePortfolioRequest {
  tickers: string[];
  quantities: number[];
  portfolioValue?: number;
  targetBeta?: number;
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
