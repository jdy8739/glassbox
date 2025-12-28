/**
 * Shared TypeScript types for Glassbox
 */

/**
 * Asset or ticker in a portfolio
 */
export interface Ticker {
  symbol: string;
  name?: string;
  price?: number;
  exchange?: string;
}

/**
 * Portfolio item - ticker with quantity
 */
export interface PortfolioItem {
  symbol: string;
  quantity: number;
  name?: string;
}

/**
 * Portfolio input - list of assets to analyze
 */
export interface PortfolioInput {
  items: PortfolioItem[];
  startDate?: string;
  endDate?: string;
  targetBeta?: number;
}

/**
 * Portfolio weights in optimal allocation
 */
export interface PortfolioWeights {
  [symbol: string]: number;
}

/**
 * Portfolio statistics
 */
export interface PortfolioStats {
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  beta?: number;
}

/**
 * Efficient frontier portfolio
 */
export interface EfficientPortfolio {
  name: string;
  weights: PortfolioWeights;
  stats: PortfolioStats;
}

/**
 * Analysis result from optimization
 */
export interface AnalysisResult {
  portfolioId?: string;
  inputPortfolio: PortfolioInput;
  efficientFrontier: {
    portfolios: EfficientPortfolio[];
    gmv?: EfficientPortfolio;
    maxSharpe?: EfficientPortfolio;
    riskFreeRate?: number;
  };
  hedging: {
    currentBeta: number;
    targetBeta: number;
    hedgeType: 'spy' | 'futures';
    spy?: {
      sharesToShort: number;
      notionalAmount: number;
    };
    futures?: {
      contractsToShort: number;
      notionalAmount: number;
    };
  };
  metadata: {
    timestamp: string;
    historicalPeriod: string;
    sampleSize?: number;
  };
}

/**
 * Saved portfolio in database
 */
export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  items: PortfolioItem[];
  analysisResult?: AnalysisResult;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  skip: number;
  take: number;
}

/**
 * Price history data point
 */
export interface PriceDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjustedClose: number;
  volume: number;
}

/**
 * Returns calculation method
 */
export type ReturnsMethod = 'log' | 'simple';

/**
 * Covariance matrix type
 */
export type CovarianceMatrix = number[][];

/**
 * Mean returns vector
 */
export type MeanReturns = number[];
