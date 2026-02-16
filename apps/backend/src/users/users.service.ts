import {
  Injectable,
  Logger,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SyncUserDto } from './dto/sync-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async syncUser(dto: SyncUserDto) {
    const timestamp = new Date().toISOString();

    // Audit log: OAuth sync attempt
    this.logger.log({
      event: 'OAUTH_SYNC_ATTEMPT',
      email: dto.email,
      timestamp,
    });

    // Check if user exists
    const existingUser = await this.findByEmail(dto.email);

    if (existingUser) {
      // Audit log: OAuth user updated
      this.logger.log({
        event: 'OAUTH_USER_UPDATED',
        userId: existingUser.id,
        email: dto.email,
        timestamp,
      });

      // Update user info if changed
      return this.prisma.user.update({
        where: { email: dto.email },
        data: {
          name: dto.name,
          googleId: dto.googleId,
        },
      });
    }

    // Create new user
    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        googleId: dto.googleId,
      },
    });

    // Audit log: OAuth user created
    this.logger.log({
      event: 'OAUTH_USER_CREATED',
      userId: newUser.id,
      email: dto.email,
      timestamp,
    });

    return newUser;
  }

  async updateUserName(userId: string, name: string) {
    this.logger.log(`Updating user ${userId} name to: ${name}`);
    return this.prisma.user.update({
      where: { id: userId },
      data: { name },
    });
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const timestamp = new Date().toISOString();

    // Fetch user with password
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check if user is OAuth user (no password)
    if (user.googleId) {
      this.logger.warn({
        event: 'PASSWORD_CHANGE_OAUTH_ATTEMPT',
        userId,
        timestamp,
      });
      throw new BadRequestException(
        'Cannot change password for OAuth accounts',
      );
    }

    // Verify user has a password
    if (!user.password) {
      throw new BadRequestException('User has no password set');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      this.logger.warn({
        event: 'PASSWORD_CHANGE_FAILED_WRONG_PASSWORD',
        userId,
        timestamp,
      });
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Audit log: password changed successfully
    this.logger.log({
      event: 'PASSWORD_CHANGED',
      userId,
      timestamp,
    });
  }

  async deleteUser(userId: string) {
    const timestamp = new Date().toISOString();

    // Audit log: account deletion
    this.logger.warn({
      event: 'ACCOUNT_DELETED',
      userId,
      timestamp,
    });

    try {
      // Prisma will cascade delete portfolios due to onDelete: Cascade in schema
      return await this.prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      // Audit log: deletion error
      this.logger.error({
        event: 'ACCOUNT_DELETION_ERROR',
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp,
      });
      throw error;
    }
  }
}
