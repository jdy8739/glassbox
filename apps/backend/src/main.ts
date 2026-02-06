import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PinoLoggerService } from './logger/pino-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(PinoLoggerService);
  app.useLogger(logger);

  // Security headers with Helmet
  app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
    crossOriginEmbedderPolicy: false, // Allow embedding (if needed for Swagger)
  }));

  logger.log('Security headers enabled with Helmet');

  // Enable cookie parsing
  app.use(cookieParser());

  // Enable CORS for Next.js frontend
  const frontendUrl = process.env.FRONTEND_URL;
  if (!frontendUrl) {
    logger.warn('FRONTEND_URL not set, defaulting to http://localhost:3000');
  }

  app.enableCors({
    origin: frontendUrl || 'http://localhost:3000',
    credentials: true,
  });

  logger.log(`CORS enabled for origin: ${frontendUrl || 'http://localhost:3000'}`);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Glassbox API')
    .setDescription('Portfolio optimization and beta hedging API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  app.get(PinoLoggerService).log(`Glassbox backend running on http://localhost:${port}`);
  app.get(PinoLoggerService).log(`API documentation available at http://localhost:${port}/api`);
}

bootstrap().catch((err) => {
  const logger = new PinoLoggerService();
  logger.error({
    msg: 'Failed to start application',
    error: err.message,
    stack: err.stack,
  });
  // Also log to console for immediate visibility
  console.error('\n❌ Application failed to start:');
  console.error(err);
  process.exit(1);
});
