import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Extract from cookie first
        (request: Request) => {
          if (!request?.cookies?.accessToken) {
             console.log('JwtStrategy: No accessToken cookie found. Cookie keys:', Object.keys(request?.cookies || {}));
          }
          return request?.cookies?.accessToken;
        },
        // Fallback to Authorization header (for backward compatibility)
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET ||
        process.env.NEXTAUTH_SECRET ||
        'fallback-secret-key',
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub || payload.userId,
      email: payload.email,
    };
  }
}
