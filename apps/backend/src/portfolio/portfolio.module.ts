import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { PythonExecutorService } from './python-executor.service';
import { PinoLoggerService } from '../logger/pino-logger.service';

@Module({
  controllers: [PortfolioController],
  providers: [PortfolioService, PythonExecutorService, PinoLoggerService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
