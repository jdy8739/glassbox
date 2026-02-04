import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  UseGuards,
  Request,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { SyncUserDto } from './dto/sync-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../auth/public.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('sync')
  @Public()
  async syncUser(@Body() dto: SyncUserDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.usersService.syncUser(dto);

    // Generate JWT token for OAuth user
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    // Set httpOnly cookie (same spec as manual auth)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user without token
    return user;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req: any, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUserName(req.user.userId, dto.name);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAccount(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    await this.usersService.deleteUser(req.user.userId);

    // Clear the auth cookie
    res.clearCookie('accessToken');

    return;
  }
}
