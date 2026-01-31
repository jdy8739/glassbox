import { Injectable, Logger } from '@nestjs/common';
import { PythonExecutorService } from './python-executor.service';
import { AnalyzePortfolioDto } from './dto/analyze-portfolio.dto';
import { PortfolioAnalysisResultDto } from './dto/portfolio-analysis-result.dto';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(private readonly pythonExecutor: PythonExecutorService) {}

  /**
   * Analyze portfolio and calculate efficient frontier
   * @param dto Portfolio analysis request
   * @returns Portfolio analysis results
   */
  async analyzePortfolio(dto: AnalyzePortfolioDto): Promise<PortfolioAnalysisResultDto> {
    this.logger.log(`Analyzing portfolio with ${dto.tickers.length} assets`);

    // Validate that tickers and quantities have same length
    if (dto.tickers.length !== dto.quantities.length) {
      throw new Error('Tickers and quantities arrays must have the same length');
    }

    // Set defaults
    const portfolioValue = dto.portfolioValue || 100000;
    const targetBeta = dto.targetBeta !== undefined ? dto.targetBeta : 0;
    const startDate = dto.startDate;
    const endDate = dto.endDate;

    // Execute Python script
    const result = await this.pythonExecutor.executeEfficientFrontier({
      tickers: dto.tickers,
      quantities: dto.quantities,
      portfolioValue,
      targetBeta,
      startDate,
      endDate,
    });

    this.logger.log('Portfolio analysis completed successfully');

    // Return formatted result
    return {
      gmv: result.gmv,
      maxSharpe: result.maxSharpe,
      efficientFrontier: result.efficientFrontier,
      randomPortfolios: result.randomPortfolios,
      portfolioBeta: result.portfolioBeta,
      hedging: result.hedging,
      riskFreeRate: result.riskFreeRate,
      analysisDate: startDate,
      analysisEndDate: endDate,
    };
  }

  /**
   * Health check for Python environment
   * @returns Promise<boolean>
   */
  async checkPythonHealth(): Promise<boolean> {
    return this.pythonExecutor.checkPythonEnvironment();
  }
}
