import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { TickerService, TickerSearchResult } from './ticker.service';
import { LogAction } from '../common/decorators/log-action.decorator';
import { Public } from '../auth/public.decorator';

@ApiTags('Ticker')
@Controller('ticker')
export class TickerController {
  constructor(private readonly tickerService: TickerService) {}

  @Get('search')
  @Public()
  @LogAction('SEARCH_TICKERS')
  @ApiOperation({ summary: 'Search for ticker symbols' })
  @ApiQuery({
    name: 'q',
    description: 'Search query (ticker symbol or company name)',
    example: 'Apple',
  })
  @ApiResponse({
    status: 200,
    description: 'List of matching tickers',
    type: [Object],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameter',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to fetch tickers',
  })
  async searchTickers(
    @Query('q') query: string,
  ): Promise<TickerSearchResult[]> {
    return this.tickerService.searchTickers(query);
  }

  @Get('quote')
  @Public()
  @LogAction('GET_QUOTE')
  @ApiOperation({ summary: 'Get quote for a specific ticker' })
  @ApiQuery({
    name: 'symbol',
    description: 'Ticker symbol',
    example: 'AAPL',
  })
  @ApiResponse({
    status: 200,
    description: 'Quote data for the ticker',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to fetch quote',
  })
  async getQuote(@Query('symbol') symbol: string) {
    return this.tickerService.getQuote(symbol);
  }
}
