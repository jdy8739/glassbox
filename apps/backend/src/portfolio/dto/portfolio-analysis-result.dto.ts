import { ApiProperty } from '@nestjs/swagger';

export class PortfolioStatsDto {
  @ApiProperty({ description: 'Expected annual return', example: 0.125 })
  return!: number;

  @ApiProperty({ description: 'Annual volatility (standard deviation)', example: 0.083 })
  volatility!: number;

  @ApiProperty({ description: 'Sharpe ratio', example: 1.25 })
  sharpe!: number;
}

export class OptimalPortfolioDto {
  @ApiProperty({
    description: 'Asset weights (ticker -> weight)',
    example: { AAPL: 0.245, MSFT: 0.182, NVDA: 0.158, SGOV: 0.191 },
  })
  weights!: Record<string, number>;

  @ApiProperty({ description: 'Portfolio statistics', type: PortfolioStatsDto })
  stats!: PortfolioStatsDto;
}

export class FrontierPointDto {
  @ApiProperty({ description: 'Expected annual return', example: 0.15 })
  return!: number;

  @ApiProperty({ description: 'Annual volatility', example: 0.12 })
  volatility!: number;

  @ApiProperty({ description: 'Sharpe ratio', example: 1.1 })
  sharpeRatio!: number;
}

export class HedgingDto {
  @ApiProperty({ description: 'Number of SPY shares to short', example: 42 })
  spyShares!: number;

  @ApiProperty({ description: 'SPY hedge notional value', example: 18500 })
  spyNotional!: number;

  @ApiProperty({ description: 'Number of ES futures contracts to short', example: 7 })
  esContracts!: number;

  @ApiProperty({ description: 'ES futures hedge notional value', example: 17850 })
  esNotional!: number;
}

export class PortfolioAnalysisResultDto {
  @ApiProperty({ description: 'Global Minimum Variance portfolio', type: OptimalPortfolioDto })
  gmv!: OptimalPortfolioDto;

  @ApiProperty({ description: 'Maximum Sharpe Ratio portfolio', type: OptimalPortfolioDto })
  maxSharpe!: OptimalPortfolioDto;

  @ApiProperty({
    description: 'Efficient frontier points',
    type: [FrontierPointDto],
  })
  efficientFrontier!: FrontierPointDto[];

  @ApiProperty({
    description: 'Random portfolios for visualization',
    type: [FrontierPointDto],
    required: false,
  })
  randomPortfolios?: FrontierPointDto[];

  @ApiProperty({ description: 'Portfolio beta against S&P 500', example: 1.25 })
  portfolioBeta!: number;

  @ApiProperty({ description: 'Hedging recommendations', type: HedgingDto })
  hedging!: HedgingDto;

  @ApiProperty({
    description: 'Risk-free rate used for calculation (annualized)',
    example: 0.045,
  })
  riskFreeRate!: number;

  @ApiProperty({
    description: 'Start date used for historical analysis',
    example: '2023-01-01',
    required: false,
  })
  analysisDate?: string;
}
