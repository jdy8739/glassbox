import { Controller, Post, Body, Get, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { AnalyzePortfolioDto } from './dto/analyze-portfolio.dto';
import { PortfolioAnalysisResultDto } from './dto/portfolio-analysis-result.dto';
import { PinoLoggerService } from '../logger/pino-logger.service';

@ApiTags('portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly logger: PinoLoggerService,
  ) {}

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Analyze portfolio and calculate efficient frontier',
    description:
      'Analyzes a portfolio of stocks, calculates the efficient frontier, ' +
      'optimal portfolios (GMV and Max Sharpe), and provides beta hedging recommendations.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Portfolio analysis completed successfully',
    type: PortfolioAnalysisResultDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to analyze portfolio',
  })
  async analyzePortfolio(@Body() dto: AnalyzePortfolioDto): Promise<PortfolioAnalysisResultDto> {
    this.logger.log(`Analyzing portfolio: ${dto.tickers.join(', ')}`);

    try {
      const result = await this.portfolioService.analyzePortfolio(dto);
      this.logger.log('Portfolio analysis successful');
      return result;
    } catch (error) {
      this.logger.error('Portfolio analysis failed', error);
      throw error;
    }
  }

  @Get('health')
  @ApiOperation({
    summary: 'Check Python environment health',
    description: 'Verifies that the Python environment is properly configured',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Python environment is healthy',
  })
  async checkHealth(): Promise<{ status: string; pythonAvailable: boolean }> {
    const pythonAvailable = await this.portfolioService.checkPythonHealth();

    return {
      status: pythonAvailable ? 'healthy' : 'unhealthy',
      pythonAvailable,
    };
  }
}
