import { Controller, Post, Body, Get, Put, Delete, Param, HttpStatus, HttpCode, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { AnalyzePortfolioDto } from './dto/analyze-portfolio.dto';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PortfolioAnalysisResultDto } from './dto/portfolio-analysis-result.dto';
import { PinoLoggerService } from '../logger/pino-logger.service';
import { Public } from '../auth/public.decorator';

@ApiTags('portfolio')
@Controller('portfolio')
@ApiBearerAuth()
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly logger: PinoLoggerService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new portfolio' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Portfolio created successfully' })
  async create(@Request() req: any, @Body() dto: CreatePortfolioDto) {
    this.logger.log(`Creating portfolio for user ${req.user.userId}`);
    return this.portfolioService.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all portfolios for current user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of portfolios' })
  async findAll(@Request() req: any) {
    return this.portfolioService.findAll(req.user.userId);
  }

  @Get('health')
  @Public()
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

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific portfolio by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Portfolio details' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Portfolio not found' })
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.portfolioService.findOne(req.user.userId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a portfolio' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Portfolio updated successfully' })
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdatePortfolioDto,
  ) {
    return this.portfolioService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a portfolio' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Portfolio deleted successfully' })
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.portfolioService.remove(req.user.userId, id);
  }

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
}
