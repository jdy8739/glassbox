import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TickerModule } from './ticker/ticker.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { PinoLoggerService } from './logger/pino-logger.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

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
    PrismaModule,
    AuthModule,
    UsersModule,
    TickerModule,
    PortfolioModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PinoLoggerService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
