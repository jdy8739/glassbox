import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { DataService, TickerSearchResult } from './data.service';

@ApiTags('Data')
@Controller('tickers')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('search')
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
    return this.dataService.searchTickers(query);
  }

  @Get('quote')
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
    return this.dataService.getQuote(symbol);
  }
}
