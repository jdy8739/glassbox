import { Injectable, Logger } from '@nestjs/common';
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
    this.logger.log(`Syncing user: ${dto.email}`);

    // Check if user exists
    const existingUser = await this.findByEmail(dto.email);

    if (existingUser) {
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
    return this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        googleId: dto.googleId,
      },
    });
  }

  async createUser(data: { email: string; name?: string; googleId?: string }) {
    return this.prisma.user.create({
      data,
    });
  }
}
