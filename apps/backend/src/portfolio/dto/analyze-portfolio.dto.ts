import { IsArray, IsNumber, IsOptional, ArrayMinSize, Min, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayLengthMatch } from '../../common/validators/array-length-match.validator';

export class AnalyzePortfolioDto {
  @ApiProperty({
    description: 'Array of stock ticker symbols',
    example: ['AAPL', 'MSFT', 'NVDA', 'GOOG'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  tickers!: string[];

  @ApiProperty({
    description: 'Array of quantities for each ticker (must be non-negative)',
    example: [10, 20, 15, 8],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @ArrayLengthMatch('tickers', { message: 'Tickers and quantities arrays must have the same length' })
  @Type(() => Number)
  quantities!: number[];

  @ApiProperty({
    description: 'Total portfolio value in dollars',
    example: 100000,
    required: false,
  })
  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  portfolioValue?: number;

  @ApiProperty({
    description: 'Target beta for hedging (0 = market-neutral)',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  targetBeta?: number;

  @ApiProperty({
    description: 'Start date for historical data (YYYY-MM-DD)',
    example: '2023-01-01',
    required: true,
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate must be in YYYY-MM-DD format',
  })
  startDate!: string;

  @ApiProperty({
    description: 'End date for historical data (YYYY-MM-DD)',
    example: '2024-12-31',
    required: true,
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'endDate must be in YYYY-MM-DD format',
  })
  endDate!: string;
}
