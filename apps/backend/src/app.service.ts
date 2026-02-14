import { Injectable } from '@nestjs/common';
import { PortfolioService } from './portfolio/portfolio.service';

@Injectable()
export class AppService {
  constructor(private readonly portfolioService: PortfolioService) {}

  async getHealth() {
    // Check if Python worker is available
    const pythonOk = await this.portfolioService.checkPythonHealth();

    return {
      status: pythonOk ? 'ok' : 'error',
      python: pythonOk,
      timestamp: new Date().toISOString(),
    };
  }

  getInfo() {
    return {
      name: 'Glassbox API',
      version: '0.1.0',
      description: 'Portfolio optimization and beta hedging API',
      docs: '/api',
    };
  }
}
