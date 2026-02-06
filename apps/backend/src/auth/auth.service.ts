import { Injectable, ConflictException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly SALT_ROUNDS = 10;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const timestamp = new Date().toISOString();

    // Audit log: signup attempt
    this.logger.log({
      event: 'SIGNUP_ATTEMPT',
      email: dto.email,
      timestamp,
    });

    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        // Audit log: signup failed (duplicate)
        this.logger.warn({
          event: 'SIGNUP_FAILED',
          email: dto.email,
          reason: 'EMAIL_ALREADY_EXISTS',
          timestamp,
        });
        throw new ConflictException('Email already registered');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      // Audit log: signup success
      this.logger.log({
        event: 'SIGNUP_SUCCESS',
        userId: user.id,
        email: user.email,
        timestamp,
      });

      // Generate JWT token
      const tokens = await this.generateTokens(user.id, user.email);

      return {
        user,
        ...tokens,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      // Audit log: signup error
      this.logger.error({
        event: 'SIGNUP_ERROR',
        email: dto.email,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp,
      });
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const timestamp = new Date().toISOString();

    // Audit log: login attempt
    this.logger.log({
      event: 'LOGIN_ATTEMPT',
      email: dto.email,
      timestamp,
    });

    try {
      // Find user
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        // Audit log: login failed (user not found)
        this.logger.warn({
          event: 'LOGIN_FAILED',
          email: dto.email,
          reason: 'USER_NOT_FOUND',
          timestamp,
        });
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check if user has a password (not OAuth-only user)
      if (!user.password) {
        // Audit log: login failed (OAuth user trying manual login)
        this.logger.warn({
          event: 'LOGIN_FAILED',
          email: dto.email,
          userId: user.id,
          reason: 'OAUTH_ONLY_ACCOUNT',
          timestamp,
        });
        throw new UnauthorizedException('This account uses Google Sign-In. Please login with Google.');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);

      if (!isPasswordValid) {
        // Audit log: login failed (invalid password)
        this.logger.warn({
          event: 'LOGIN_FAILED',
          email: dto.email,
          userId: user.id,
          reason: 'INVALID_PASSWORD',
          timestamp,
        });
        throw new UnauthorizedException('Invalid credentials');
      }

      // Audit log: login success
      this.logger.log({
        event: 'LOGIN_SUCCESS',
        userId: user.id,
        email: user.email,
        timestamp,
      });

      // Generate JWT token
      const tokens = await this.generateTokens(user.id, user.email);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
        ...tokens,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // Audit log: login error
      this.logger.error({
        event: 'LOGIN_ERROR',
        email: dto.email,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp,
      });
      throw error;
    }
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 604800, // 7 days in seconds
    };
  }
}
