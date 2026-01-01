import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TickerModule } from './ticker/ticker.module';
import { PinoLoggerService } from './logger/pino-logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 3600, // 1 hour in seconds
      max: 100, // maximum number of items in cache
    }),
    TickerModule,
  ],
  controllers: [AppController],
  providers: [AppService, PinoLoggerService],
})
export class AppModule {}
