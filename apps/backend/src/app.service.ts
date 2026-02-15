import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      name: 'Glassbox API',
      version: '0.1.0',
      description: 'Portfolio optimization and beta hedging API',
      docs: '/api',
    };
  }
}
