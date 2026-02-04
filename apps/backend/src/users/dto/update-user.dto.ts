import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Name must be less than 50 characters' })
  @Matches(/^[a-zA-Z\s'\-\.]+$/, {
    message: 'Name can only contain letters, spaces, hyphens, apostrophes, and periods',
  })
  name!: string;
}
