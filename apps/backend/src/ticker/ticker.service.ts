import { Injectable, Inject, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import yahooFinance from 'yahoo-finance2';

export interface TickerSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

@Injectable()
export class TickerService {
  private readonly logger = new Logger(TickerService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async searchTickers(query: string): Promise<TickerSearchResult[]> {
    if (!query || query.trim().length === 0) {
      throw new HttpException(
        'Query parameter is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const sanitizedQuery = query.trim();
    const cacheKey = `ticker:search:${sanitizedQuery.toLowerCase()}`;

    // Try to get from cache
    const cached = await this.cacheManager.get<TickerSearchResult[]>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache HIT: ${cacheKey}`);
      return cached;
    }

    this.logger.debug(`Cache MISS: ${cacheKey}`);

    try {
      // Fetch from Yahoo Finance
      const results = await yahooFinance.search(sanitizedQuery);

      // Filter and transform results
      const filtered: TickerSearchResult[] = results.quotes
        .filter((q: any) => q.isYahooFinance !== false && q.quoteType === 'EQUITY') // Only stocks from Yahoo Finance
        .slice(0, 10) // Limit to 10 results
        .map((q: any) => ({
          symbol: q.symbol,
          name: q.longname || q.shortname || q.symbol,
          exchange: q.exchange || 'N/A',
          type: q.quoteType,
        }));

      // Store in cache (TTL from CacheModule config: 1 hour)
      await this.cacheManager.set(cacheKey, filtered);

      return filtered;
    } catch (error) {
      this.logger.error('Error fetching tickers from Yahoo Finance:', error);
      throw new HttpException(
        'Failed to search tickers',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getQuote(ticker: string) {
    const cacheKey = `ticker:quote:${ticker.toUpperCase()}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      this.logger.debug(`Cache HIT: ${cacheKey}`);
      return cached;
    }

    this.logger.debug(`Cache MISS: ${cacheKey}`);

    try {
      const quote = await yahooFinance.quote(ticker);

      // Cache quotes for 5 minutes (300 seconds)
      await this.cacheManager.set(cacheKey, quote, 300);

      return quote;
    } catch (error) {
      this.logger.error('Error fetching quote from Yahoo Finance:', error);
      throw new HttpException(
        'Failed to get quote',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getHistoricalPrices(
    ticker: string,
    startDate: string,
    endDate: string,
  ) {
    const cacheKey = `ticker:history:${ticker}:${startDate}:${endDate}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      this.logger.debug(`Cache HIT: ${cacheKey}`);
      return cached;
    }

    this.logger.debug(`Cache MISS: ${cacheKey}`);

    try {
      const history = await yahooFinance.historical(ticker, {
        period1: startDate,
        period2: endDate,
      });

      // Cache historical data for 24 hours (86400 seconds)
      await this.cacheManager.set(cacheKey, history, 86400);

      return history;
    } catch (error) {
      this.logger.error('Error fetching historical prices from Yahoo Finance:', error);
      throw new HttpException(
        'Failed to get historical prices',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
