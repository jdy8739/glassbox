import { IsString, IsArray, ArrayMinSize, IsNumber, Min, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayLengthMatch } from '../../common/validators/array-length-match.validator';

export class CreatePortfolioDto {
  @ApiProperty({
    description: 'Name of the portfolio',
    example: 'My Tech Portfolio',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Array of stock ticker symbols',
    example: ['AAPL', 'MSFT', 'NVDA'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  tickers!: string[];

  @ApiProperty({
    description: 'Array of quantities for each ticker',
    example: [10, 20, 15],
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
    description: 'Analysis snapshot (JSON)',
    required: false,
  })
  @IsOptional()
  @IsObject()
  analysisSnapshot?: Record<string, any>;
}