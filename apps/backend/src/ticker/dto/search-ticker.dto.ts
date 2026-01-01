import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchTickerDto {
  @ApiProperty({
    description: 'Search query for ticker symbols',
    example: 'Apple',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  q!: string;
}
