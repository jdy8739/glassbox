import { IsArray, IsNumber, IsOptional, ArrayMinSize, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzePortfolioDto {
  @ApiProperty({
    description: 'Array of stock ticker symbols',
    example: ['AAPL', 'MSFT', 'NVDA', 'GOOG'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  tickers!: string[];

  @ApiProperty({
    description: 'Array of quantities for each ticker',
    example: [10, 20, 15, 8],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(1)
  quantities!: number[];

  @ApiProperty({
    description: 'Total portfolio value in dollars',
    example: 100000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  portfolioValue?: number;

  @ApiProperty({
    description: 'Target beta for hedging (0 = market-neutral)',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  targetBeta?: number;

  @ApiProperty({
    description: 'Start date for historical data (YYYY-MM-DD)',
    example: '2023-01-01',
    required: false,
  })
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: 'End date for historical data (YYYY-MM-DD)',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  endDate?: string;
}
