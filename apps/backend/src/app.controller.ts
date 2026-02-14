import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './auth/public.decorator';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('health')
  async getHealth() {
    const health = await this.appService.getHealth();
    return health;
  }

  @Get()
  getInfo() {
    return this.appService.getInfo();
  }
}
