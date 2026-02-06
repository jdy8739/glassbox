# Glassbox Security Audit Report

**Date:** 2026-02-06
**Scope:** Authentication flow, JWT handling, logging system
**Status:** Pre-deployment review

---

## Executive Summary

### Overall Security Status: **NEEDS IMPROVEMENT** ⚠️

The application has a solid foundation but requires critical security enhancements before production deployment:

- ✅ **GOOD:** httpOnly cookies, JWT strategy, password hashing
- ⚠️ **MISSING:** Security headers, rate limiting, HTTPS enforcement
- ⚠️ **NEEDS FIX:** Fallback secrets, console.log in production, missing error sanitization

---

## 1. Authentication Flow Analysis

### 1.1 Authentication Architecture

```
Browser → NextAuth.js (OAuth) → Backend (JWT validation) → Protected Resources
         ↓
         httpOnly Cookie (accessToken)
```

**Flow:**
1. User signs in via Google OAuth (NextAuth.js)
2. NextAuth calls `/users/sync` to create/update user in backend
3. Backend generates JWT and sets httpOnly cookie
4. Subsequent requests use cookie for authentication
5. Backend validates JWT from cookie via JwtStrategy

### 1.2 Security Assessment

#### ✅ STRENGTHS

1. **httpOnly Cookies**
   - Location: `apps/backend/src/auth/auth.controller.ts:18-23`
   - Prevents XSS attacks by making token inaccessible to JavaScript
   - Proper settings: `httpOnly: true`, `sameSite: 'lax'`

2. **Password Hashing**
   - Uses bcrypt for password storage (assumed from bcrypt dependency)
   - Industry-standard hashing algorithm

3. **JWT Expiration**
   - Set to 7 days (reasonable for web app)
   - Matches cookie maxAge

4. **CORS Configuration**
   - Location: `apps/backend/src/main.ts:19-22`
   - Properly configured with credentials support
   - Origin restricted to frontend URL

5. **Input Validation**
   - Global ValidationPipe enabled with whitelist and forbidNonWhitelisted
   - Location: `apps/backend/src/main.ts:25-31`
   - Prevents injection of unexpected properties

#### ⚠️ CRITICAL ISSUES

1. **Fallback Secrets in Production** (HIGH RISK)
   - Location: `apps/backend/src/auth/jwt.strategy.ts:22-25`
   ```typescript
   secretOrKey:
     process.env.JWT_SECRET ||
     process.env.NEXTAUTH_SECRET ||
     'fallback-secret-key',  // ⚠️ DANGEROUS
   ```
   - **Risk:** If environment variables fail to load, app uses weak secret
   - **Impact:** Token forgery, complete authentication bypass
   - **Fix:** Remove fallback, throw error if secrets missing

2. **No HTTPS Enforcement** (HIGH RISK)
   - Location: `apps/backend/src/auth/auth.controller.ts:20`
   ```typescript
   secure: process.env.NODE_ENV === 'production',
   ```
   - **Risk:** Tokens transmitted over HTTP in misconfigured production
   - **Impact:** Man-in-the-middle attacks, session hijacking
   - **Fix:** Add HTTPS redirect middleware, use Helmet

3. **Missing Security Headers** (MEDIUM RISK)
   - No Helmet.js or security headers configured
   - **Missing headers:**
     - `Strict-Transport-Security` (HSTS)
     - `X-Content-Type-Options: nosniff`
     - `X-Frame-Options: DENY`
     - `Content-Security-Policy`
   - **Fix:** Install and configure Helmet.js

4. **No Rate Limiting** (MEDIUM RISK)
   - No rate limiting on authentication endpoints
   - **Risk:** Brute force attacks on `/auth/login`, `/auth/signup`
   - **Fix:** Install @nestjs/throttler

5. **Console.log in Production Code** (LOW RISK)
   - Location: `apps/backend/src/auth/jwt.strategy.ts:14`
   - Location: `apps/backend/src/main.ts:51-52`
   ```typescript
   console.log('JwtStrategy: No accessToken cookie found...')
   console.error(err);
   ```
   - **Risk:** Sensitive data leakage in logs
   - **Fix:** Replace with PinoLoggerService

6. **No Secret Rotation Strategy** (MEDIUM RISK)
   - JWT_SECRET is static, no rotation mechanism
   - **Risk:** Compromised secrets remain valid indefinitely
   - **Fix:** Implement secret versioning or periodic rotation

---

## 2. JWT Security Analysis

### 2.1 JWT Configuration

**Current Settings:**
- Algorithm: Default (HS256 assumed from passport-jwt)
- Expiration: 7 days (604800 seconds)
- Secret: From environment variables
- Storage: httpOnly cookie

### 2.2 Security Assessment

#### ✅ GOOD PRACTICES

1. **Token Extraction Priority**
   - Location: `apps/backend/src/auth/jwt.strategy.ts:10-20`
   - Checks cookie first, then Authorization header
   - Good fallback strategy for API clients

2. **No Token Exposure**
   - Tokens never sent in response body
   - Always in httpOnly cookies

3. **Proper Payload Structure**
   - Location: `apps/backend/src/auth/jwt.strategy.ts:29-34`
   - Minimal claims: `sub` (userId), `email`
   - No sensitive data in token

#### ⚠️ CONCERNS

1. **No Token Refresh Mechanism**
   - 7-day tokens without refresh means:
     - User must re-authenticate every 7 days
     - OR use long-lived tokens (security vs UX tradeoff)
   - **Recommendation:** Implement refresh token pattern

2. **No Token Blacklist**
   - Logout clears cookie but token remains valid until expiration
   - **Risk:** Stolen tokens can be used until they expire
   - **Fix:** Implement Redis-based token blacklist

3. **No Token Version Control**
   - Can't invalidate all tokens for a user (e.g., password change)
   - **Fix:** Add `tokenVersion` field to user model

---

## 3. Session Management

### 3.1 Cookie Configuration

**Settings:**
```typescript
{
  httpOnly: true,          // ✅ Prevents XSS
  secure: NODE_ENV === 'production',  // ⚠️ Only if HTTPS enforced
  sameSite: 'lax',         // ✅ CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
}
```

### 3.2 Assessment

#### ✅ GOOD
- `httpOnly: true` prevents JavaScript access
- `sameSite: 'lax'` provides CSRF protection
- Reasonable expiration time

#### ⚠️ IMPROVEMENTS NEEDED

1. **SameSite should be 'strict' for sensitive operations**
   - `lax` allows cookies on top-level navigation
   - Consider `strict` for higher security (may affect UX)

2. **Missing Secure flag enforcement**
   - Should FAIL if HTTPS is not available in production
   - Current: Falls back to HTTP if HTTPS unavailable

3. **No Cookie Signing**
   - Cookies are not signed (integrity not verified)
   - **Fix:** Use signed cookies via cookie-parser

---

## 4. Logging System Analysis

### 4.1 Current Implementation

**Logger:** Pino (production-grade logger)
**Location:** `apps/backend/src/logger/pino-logger.service.ts`

**Configuration:**
- Development: Pretty-printed with colors
- Production: JSON format
- Log level: `debug` (dev), `info` (prod)

### 4.2 Security Assessment

#### ✅ GOOD PRACTICES

1. **Structured Logging**
   - JSON format in production for log aggregation
   - Pino is fast and production-ready

2. **Log Levels**
   - Appropriate level separation (debug, info, warn, error)
   - Debug logs disabled in production

3. **No Third-party Logging Service (Yet)**
   - Good for MVP, but production should use log aggregation

#### ⚠️ CRITICAL ISSUES

1. **Console.log Usage in Production Code** (HIGH RISK)
   - Location: `apps/backend/src/auth/jwt.strategy.ts:14`
   - Location: `apps/backend/src/main.ts:51-52`
   - **Risk:** Bypasses structured logging, may leak sensitive data
   - **Impact:** Cookie keys logged in plain text
   ```typescript
   console.log('JwtStrategy: No accessToken cookie found. Cookie keys:', Object.keys(request?.cookies || {}));
   ```

2. **No Log Sanitization** (MEDIUM RISK)
   - Error messages may contain sensitive data
   - Location: `apps/web/src/lib/auth.ts:80-81`
   ```typescript
   console.error('Failed to sync user with backend:', await response.text());
   ```
   - **Risk:** Passwords, tokens, or PII in error logs

3. **No Audit Trail** (MEDIUM RISK)
   - No logging of authentication events:
     - Login attempts (success/failure)
     - Logout events
     - Token validation failures
     - Account changes
   - **Impact:** Cannot detect brute force or suspicious activity

4. **No Log Retention Policy** (LOW RISK)
   - Logs may grow indefinitely
   - **Fix:** Configure log rotation

---

## 5. Frontend Security (Next.js)

### 5.1 NextAuth.js Configuration

**Location:** `apps/web/src/lib/auth.ts`

#### ✅ GOOD PRACTICES

1. **Session Strategy: JWT**
   - Stateless sessions (no database lookups per request)
   - 7-day expiration matches backend

2. **Error Handling**
   - Try-catch blocks in all callbacks
   - Graceful failure handling

3. **No Console.log in Production Code**
   - Clean frontend code (0 console.log found)

#### ⚠️ CONCERNS

1. **Fallback Secret** (CRITICAL)
   - Location: `apps/web/src/lib/auth.ts:52`
   ```typescript
   secret: process.env.NEXTAUTH_SECRET || (process.env.NODE_ENV === 'development' ? 'secret-for-dev-only' : undefined),
   ```
   - **Risk:** Weak secret in development may leak to production

2. **Error Messages Expose Backend Details**
   - Location: `apps/web/src/lib/auth.ts:80`
   ```typescript
   console.error('Failed to sync user with backend:', await response.text());
   ```
   - **Risk:** Backend error details visible in browser console

3. **No CSP (Content Security Policy)**
   - No `middleware.ts` file found
   - **Risk:** XSS vulnerabilities not mitigated
   - **Fix:** Add Next.js middleware with CSP headers

4. **Google OAuth Credentials in Environment**
   - Good practice, but ensure `.env.local` is in `.gitignore`

---

## 6. Critical Vulnerabilities Summary

### HIGH PRIORITY (Fix before deployment)

| # | Vulnerability | Location | Impact | Fix |
|---|---------------|----------|--------|-----|
| 1 | Fallback JWT secret | `jwt.strategy.ts:22-25` | Token forgery | Remove fallback, fail if missing |
| 2 | No HTTPS enforcement | `auth.controller.ts:20` | MITM attacks | Add Helmet, redirect HTTP→HTTPS |
| 3 | Console.log with sensitive data | `jwt.strategy.ts:14` | Data leakage | Use PinoLoggerService |
| 4 | No rate limiting | All auth endpoints | Brute force | Add @nestjs/throttler |
| 5 | Missing security headers | `main.ts` | Multiple risks | Install Helmet.js |

### MEDIUM PRIORITY (Fix within 1 month)

| # | Vulnerability | Location | Impact | Fix |
|---|---------------|----------|--------|-----|
| 6 | No token refresh | N/A | Poor UX or insecure | Implement refresh tokens |
| 7 | No audit logging | All controllers | No attack detection | Add audit logs |
| 8 | No token blacklist | N/A | Stolen tokens valid | Redis blacklist |
| 9 | Error sanitization | Multiple locations | Info disclosure | Sanitize error responses |
| 10 | No CSP | Next.js | XSS risk | Add CSP middleware |

---

## 7. Recommendations

### 7.1 Immediate Actions (Before Deployment)

#### 1. Remove Fallback Secrets

**File:** `apps/backend/src/auth/jwt.strategy.ts`

```typescript
// CURRENT (UNSAFE)
secretOrKey:
  process.env.JWT_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  'fallback-secret-key',

// RECOMMENDED
secretOrKey: (() => {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET or NEXTAUTH_SECRET must be set');
  }
  return secret;
})(),
```

#### 2. Add Security Headers (Helmet)

**Install:**
```bash
cd apps/backend
pnpm add helmet
```

**File:** `apps/backend/src/main.ts`

```typescript
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add security headers
  app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }));

  // ... rest of config
}
```

#### 3. Add Rate Limiting

**Install:**
```bash
cd apps/backend
pnpm add @nestjs/throttler
```

**File:** `apps/backend/src/app.module.ts`

```typescript
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 10, // 10 requests per minute
    }]),
    // ... other imports
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

#### 4. Replace console.log with Logger

**File:** `apps/backend/src/auth/jwt.strategy.ts`

```typescript
import { Logger } from '@nestjs/common';

export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request?.cookies?.accessToken;
          if (!token) {
            this.logger.warn('No accessToken cookie found');
          }
          return token;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      // ... rest
    });
  }
}
```

#### 5. Add Environment Variable Validation

**Install:**
```bash
cd apps/backend
pnpm add @nestjs/config joi
```

**File:** `apps/backend/src/config/env.validation.ts`

```typescript
import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(4000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  NEXTAUTH_SECRET: Joi.string().min(32).required(),
  FRONTEND_URL: Joi.string().uri().required(),
});
```

**File:** `apps/backend/src/app.module.ts`

```typescript
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: true, // Fail on first error
      },
    }),
    // ... other imports
  ],
})
export class AppModule {}
```

#### 6. Add Audit Logging

**File:** `apps/backend/src/auth/auth.service.ts`

```typescript
import { PinoLoggerService } from '../logger/pino-logger.service';

export class AuthService {
  constructor(
    private logger: PinoLoggerService,
    // ... other deps
  ) {}

  async login(dto: LoginDto) {
    try {
      const user = await this.validateUser(dto.email, dto.password);

      if (!user) {
        this.logger.warn({
          event: 'LOGIN_FAILED',
          email: dto.email,
          reason: 'INVALID_CREDENTIALS',
          timestamp: new Date().toISOString(),
        });
        throw new UnauthorizedException('Invalid credentials');
      }

      this.logger.log({
        event: 'LOGIN_SUCCESS',
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
      });

      // ... generate token
    } catch (error) {
      this.logger.error({
        event: 'LOGIN_ERROR',
        email: dto.email,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }
}
```

---

### 7.2 Short-term Improvements (1 Month)

1. **Implement Refresh Tokens**
   - Short-lived access tokens (15 min)
   - Long-lived refresh tokens (7 days)
   - Stored in separate httpOnly cookie

2. **Add Token Blacklist (Redis)**
   - Invalidate tokens on logout
   - Invalidate all tokens on password change
   - Check blacklist on each request

3. **Implement CSP in Next.js**
   - Create `apps/web/src/middleware.ts`
   - Add Content-Security-Policy headers
   - Whitelist trusted domains

4. **Add Security Monitoring**
   - Integrate Sentry or similar for error tracking
   - Set up log aggregation (Datadog, Cloudwatch, etc.)
   - Configure alerts for suspicious activity

5. **Implement CSRF Protection**
   - Add CSRF tokens to forms
   - Validate on state-changing operations
   - Consider using `@nestjs/csrf`

---

### 7.3 Long-term Improvements (3 Months)

1. **Two-Factor Authentication (2FA)**
   - TOTP-based (Google Authenticator)
   - SMS backup option
   - Recovery codes

2. **OAuth Token Refresh**
   - Refresh Google OAuth tokens
   - Handle expired OAuth sessions

3. **Security Scanning**
   - Automated dependency scanning (Snyk, Dependabot)
   - SAST tools (SonarQube)
   - Regular penetration testing

4. **Compliance**
   - GDPR compliance (data export, deletion)
   - SOC 2 audit preparation
   - Privacy policy updates

---

## 8. Deployment Checklist

### Pre-Deployment Security Checklist

- [ ] Remove all fallback secrets
- [ ] Install and configure Helmet.js
- [ ] Add rate limiting (@nestjs/throttler)
- [ ] Replace all console.log with logger
- [ ] Validate all environment variables on startup
- [ ] Enable HTTPS enforcement
- [ ] Add security headers (HSTS, CSP, X-Frame-Options)
- [ ] Implement audit logging for auth events
- [ ] Test JWT expiration and validation
- [ ] Review CORS configuration for production
- [ ] Add `.env` to `.gitignore`
- [ ] Generate strong secrets (32+ characters)
- [ ] Test logout functionality
- [ ] Verify cookie settings in production
- [ ] Enable error sanitization (no stack traces to client)
- [ ] Set up log aggregation service
- [ ] Configure log retention policy
- [ ] Test OAuth flow end-to-end
- [ ] Review all error messages for info disclosure
- [ ] Enable production logging level (info)
- [ ] Test rate limiting thresholds

### Environment Variables Checklist

- [ ] `JWT_SECRET` set (32+ chars)
- [ ] `NEXTAUTH_SECRET` set (32+ chars, matches JWT_SECRET)
- [ ] `DATABASE_URL` set (production database)
- [ ] `FRONTEND_URL` set (production URL with HTTPS)
- [ ] `NODE_ENV=production` set
- [ ] `GOOGLE_CLIENT_ID` set (production OAuth app)
- [ ] `GOOGLE_CLIENT_SECRET` set (production OAuth app)
- [ ] `PORT` set (if not default 4000)

---

## 9. Security Monitoring Recommendations

### Metrics to Track

1. **Failed login attempts** (per IP, per user)
2. **Token validation failures**
3. **Rate limit hits**
4. **Unusual access patterns** (time of day, location)
5. **API error rates** (4xx, 5xx)

### Alerting Rules

1. **Alert:** >10 failed logins from same IP in 1 minute
2. **Alert:** >5 failed logins for same user in 5 minutes
3. **Alert:** Rate limit exceeded on auth endpoints
4. **Alert:** 5xx errors on critical endpoints
5. **Alert:** Unauthorized access attempts to protected routes

---

## 10. Conclusion

### Current State
The authentication system has a **solid foundation** with httpOnly cookies, JWT validation, and proper CORS configuration. However, **critical security gaps** exist that must be addressed before production deployment.

### Risk Level: **MEDIUM-HIGH** ⚠️

**Why:**
- Fallback secrets could lead to authentication bypass
- Missing security headers expose to common attacks
- No rate limiting enables brute force attacks
- Console.log leaks sensitive data

### Next Steps

1. **Immediate (Today):** Remove fallback secrets, add validation
2. **This Week:** Add Helmet, rate limiting, fix logging
3. **This Month:** Implement refresh tokens, audit logs, CSP
4. **Ongoing:** Monitor security metrics, update dependencies

### Final Recommendation

**DO NOT DEPLOY** to production until HIGH PRIORITY items (1-5) are fixed. The application is suitable for development/staging environments only.

---

**Report Prepared By:** Claude Code Security Audit
**Version:** 1.0
**Date:** 2026-02-06
