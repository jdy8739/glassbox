import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SyncUserDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  googleId?: string;
}
