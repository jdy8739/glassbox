import { Controller, Post, Body, Get, Put, Delete, Param, HttpStatus, HttpCode, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { AnalyzePortfolioDto } from './dto/analyze-portfolio.dto';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PortfolioAnalysisResultDto } from './dto/portfolio-analysis-result.dto';
import { Public } from '../auth/public.decorator';
import { LogAction } from '../common/decorators/log-action.decorator';

@ApiTags('portfolio')
@Controller('portfolio')
@ApiBearerAuth()
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @LogAction('CREATE_PORTFOLIO')
  @ApiOperation({ summary: 'Create a new portfolio' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Portfolio created successfully' })
  async create(@Request() req: any, @Body() dto: CreatePortfolioDto): Promise<void> {
    await this.portfolioService.create(req.user.userId, dto);
  }

  @Get()
  @LogAction('LIST_PORTFOLIOS')
  @ApiOperation({ summary: 'Get all portfolios for current user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of portfolios' })
  async findAll(@Request() req: any) {
    return this.portfolioService.findAll(req.user.userId);
  }

  @Get(':id')
  @LogAction('GET_PORTFOLIO')
  @ApiOperation({ summary: 'Get a specific portfolio by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Portfolio details' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Portfolio not found' })
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.portfolioService.findOne(req.user.userId, id);
  }

  @Put(':id')
  @LogAction('UPDATE_PORTFOLIO')
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @LogAction('DELETE_PORTFOLIO')
  @ApiOperation({ summary: 'Delete a portfolio' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Portfolio deleted successfully' })
  async remove(@Request() req: any, @Param('id') id: string): Promise<void> {
    await this.portfolioService.remove(req.user.userId, id);
  }

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @LogAction('ANALYZE_PORTFOLIO')
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
    return this.portfolioService.analyzePortfolio(dto);
  }
}
