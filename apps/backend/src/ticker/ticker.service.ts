import { Injectable, Inject, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import yahooFinance from 'yahoo-finance2';

interface YahooFinanceQuote {
  symbol: string;
  shortname?: string;
  longname?: string;
  exchange?: string;
  quoteType?: string;
  isYahooFinance?: boolean;
}

interface YahooFinanceSearchResponse {
  quotes: YahooFinanceQuote[];
}

export interface TickerSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type?: string;
}

const ALLOWED_QUOTE_TYPES = new Set(['EQUITY', 'ETF', 'CRYPTOCURRENCY']);

@Injectable()
export class TickerService {
  private readonly logger = new Logger(TickerService.name);
  private readonly yahoo = new yahooFinance();

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async searchTickers(query: string): Promise<TickerSearchResult[]> {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException('Query parameter is required');
    }

    const sanitizedQuery = query.trim();
    const cacheKey = `ticker:search:${sanitizedQuery.toLowerCase()}`;

    const cached = await this.cacheManager.get<TickerSearchResult[]>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache HIT: ${cacheKey}`);
      return cached;
    }

    this.logger.debug(`Cache MISS: ${cacheKey}`);

    try {
      // validateResult: false suppresses yahoo-finance2 schema validation errors
      // which occur when Yahoo Finance changes their API response format
      const results = (await this.yahoo.search(sanitizedQuery, {}, { validateResult: false })) as YahooFinanceSearchResponse;

      const filtered: TickerSearchResult[] = results.quotes
        .filter((q: YahooFinanceQuote) => q.isYahooFinance !== false && ALLOWED_QUOTE_TYPES.has(q.quoteType ?? ''))
        .slice(0, 10)
        .map((q: YahooFinanceQuote) => ({
          symbol: q.symbol,
          name: q.longname || q.shortname || q.symbol,
          exchange: q.exchange || 'N/A',
          type: q.quoteType,
        }));

      await this.cacheManager.set(cacheKey, filtered);

      return filtered;
    } catch (error) {
      this.logger.error('Error fetching tickers from Yahoo Finance:', error);
      throw new InternalServerErrorException('Failed to search tickers');
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
      const quote = await this.yahoo.quote(ticker);

      // Cache quotes for 5 minutes (300 seconds)
      await this.cacheManager.set(cacheKey, quote, 300);

      return quote;
    } catch (error) {
      this.logger.error('Error fetching quote from Yahoo Finance:', error);
      throw new InternalServerErrorException('Failed to get quote');
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
      const history = await this.yahoo.historical(ticker, {
        period1: startDate,
        period2: endDate,
      });

      // Cache historical data for 24 hours (86400 seconds)
      await this.cacheManager.set(cacheKey, history, 86400);

      return history;
    } catch (error) {
      this.logger.error('Error fetching historical prices from Yahoo Finance:', error);
      throw new InternalServerErrorException('Failed to get historical prices');
    }
  }
}
