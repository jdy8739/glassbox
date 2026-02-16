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
import { Throttle } from '@nestjs/throttler';
import { UsersService } from './users.service';
import { SyncUserDto } from './dto/sync-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Public } from '../auth/public.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { LogAction } from '../common/decorators/log-action.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('sync')
  @Public()
  @LogAction('OAUTH_SYNC')
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
  @LogAction('GET_PROFILE')
  async getProfile(@Request() req: any) {
    return await this.usersService.findById(req.user.userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @LogAction('UPDATE_PROFILE')
  async updateProfile(@Request() req: any, @Body() dto: UpdateUserDto) {
    return await this.usersService.updateUserName(req.user.userId, dto.name);
  }

  @Patch('me/change-password')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 900000 } }) // 5 attempts per 15 minutes
  @HttpCode(HttpStatus.NO_CONTENT)
  @LogAction('CHANGE_PASSWORD')
  async changePassword(@Request() req: any, @Body() dto: ChangePasswordDto) {
    await this.usersService.changePassword(
      req.user.userId,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @LogAction('DELETE_ACCOUNT')
  async deleteAccount(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    await this.usersService.deleteUser(req.user.userId);

    // Clear the auth cookie
    res.clearCookie('accessToken');
  }
}
