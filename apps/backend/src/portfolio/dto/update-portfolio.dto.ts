import { PartialType } from '@nestjs/swagger';
import { CreatePortfolioDto } from './create-portfolio.dto';
import { IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePortfolioDto extends PartialType(CreatePortfolioDto) {
  @ApiProperty({
    description: 'Analysis snapshot (JSON)',
    required: false,
    type: Object,
  })
  @IsOptional()
  @IsObject()
  analysisSnapshot?: Record<string, any>;
}
