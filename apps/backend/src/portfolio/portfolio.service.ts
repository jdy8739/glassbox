import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PythonExecutorService } from './python-executor.service';
import { AnalyzePortfolioDto } from './dto/analyze-portfolio.dto';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PortfolioAnalysisResultDto } from './dto/portfolio-analysis-result.dto';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pythonExecutor: PythonExecutorService,
  ) {}

  async create(userId: string, dto: CreatePortfolioDto) {
    if (dto.tickers.length !== dto.quantities.length) {
      throw new Error('Tickers and quantities arrays must have the same length');
    }

    // Extract summary stats if analysis is present
    let stats: {
      sharpeRatio?: number | null;
      volatility?: number | null;
      expectedReturn?: number | null;
      analysisDate?: string | null;
    } = {};
    if (dto.analysisSnapshot && dto.analysisSnapshot.maxSharpe?.stats) {
      stats = {
        sharpeRatio: dto.analysisSnapshot.maxSharpe.stats.sharpe,
        volatility: dto.analysisSnapshot.maxSharpe.stats.volatility,
        expectedReturn: dto.analysisSnapshot.maxSharpe.stats.return,
        analysisDate: dto.analysisSnapshot.analysisDate,
      };
    }

    return this.prisma.portfolio.create({
      data: {
        userId,
        name: dto.name,
        tickers: dto.tickers,
        quantities: dto.quantities,
        // Cast to InputJsonValue to avoid type error with 'any'
        analysisSnapshot: dto.analysisSnapshot ? (dto.analysisSnapshot as unknown as Prisma.InputJsonValue) : undefined,
        sharpeRatio: stats.sharpeRatio ?? undefined,
        volatility: stats.volatility ?? undefined,
        expectedReturn: stats.expectedReturn ?? undefined,
        analysisDate: stats.analysisDate ?? undefined,
      },
    });
  }

  async findAll(userId: string) {
    // Fetch portfolios without the large analysisSnapshot JSON
    const portfolios = await this.prisma.portfolio.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    // Reconstruct the expected structure for frontend
    return portfolios.map((p) => {
      // If we have stats, reconstruct a "lite" snapshot
      let liteSnapshot: Prisma.JsonValue = null;
      if (p.sharpeRatio !== null && p.volatility !== null && p.expectedReturn !== null) {
        liteSnapshot = {
          maxSharpe: {
            stats: {
              sharpe: p.sharpeRatio,
              volatility: p.volatility,
              return: p.expectedReturn,
            },
          },
          analysisDate: p.analysisDate || undefined,
        };
      }

      return {
        ...p,
        analysisSnapshot: liteSnapshot,
      };
    });
  }

  async findOne(userId: string, id: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
    });

    if (!portfolio) {
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
    }

    if (portfolio.userId !== userId) {
      throw new ForbiddenException('You do not have access to this portfolio');
    }

    return portfolio;
  }

  async update(userId: string, id: string, dto: UpdatePortfolioDto) {
    // Check existence and ownership first
    await this.findOne(userId, id);

    if (dto.tickers && dto.quantities && dto.tickers.length !== dto.quantities.length) {
      throw new Error('Tickers and quantities arrays must have the same length');
    }

    // Extract stats if updating snapshot
    let stats: {
      sharpeRatio?: number | null;
      volatility?: number | null;
      expectedReturn?: number | null;
      analysisDate?: string | null;
    } = {};
    if (dto.analysisSnapshot && dto.analysisSnapshot.maxSharpe?.stats) {
      stats = {
        sharpeRatio: dto.analysisSnapshot.maxSharpe.stats.sharpe,
        volatility: dto.analysisSnapshot.maxSharpe.stats.volatility,
        expectedReturn: dto.analysisSnapshot.maxSharpe.stats.return,
        analysisDate: dto.analysisSnapshot.analysisDate,
      };
    }

    return this.prisma.portfolio.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.tickers !== undefined && { tickers: dto.tickers }),
        ...(dto.quantities !== undefined && { quantities: dto.quantities }),
        ...(dto.analysisSnapshot !== undefined && { 
          analysisSnapshot: dto.analysisSnapshot as unknown as Prisma.InputJsonValue 
        }),
        ...(Object.keys(stats).length > 0 && {
          sharpeRatio: stats.sharpeRatio,
          volatility: stats.volatility,
          expectedReturn: stats.expectedReturn,
          analysisDate: stats.analysisDate,
        }),
      },
    });
  }

  async remove(userId: string, id: string) {
    // Check existence and ownership first
    await this.findOne(userId, id);

    return this.prisma.portfolio.delete({
      where: { id },
    });
  }

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