# Glassbox - Pre-Deployment Security Checklist

**Date:** 2026-02-06
**Status:** ✅ SECURITY FIXES APPLIED - Ready for Environment Setup

---

## Security Fixes Applied ✅

### 1. ✅ Removed Fallback JWT Secrets (HIGH PRIORITY)
- **File:** `apps/backend/src/auth/jwt.strategy.ts`
- **Fix:** Application now fails fast if JWT_SECRET is not set
- **Error Message:** Provides clear instructions to generate secure secret
- **Impact:** Prevents weak secrets from being used in production

### 2. ✅ Added Security Headers with Helmet (HIGH PRIORITY)
- **Files:** `apps/backend/src/main.ts`, `apps/backend/package.json`
- **Installed:** helmet@8.1.0
- **Headers Added:**
  - HSTS (Strict-Transport-Security) - 1 year with includeSubDomains
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Other security headers via Helmet defaults
- **Impact:** Protects against common web vulnerabilities

### 3. ✅ Added Rate Limiting (HIGH PRIORITY)
- **Files:** `apps/backend/src/app.module.ts`, `apps/backend/package.json`
- **Installed:** @nestjs/throttler@6.5.0
- **Limits Configured:**
  - Short: 3 requests per second
  - Medium: 20 requests per minute
  - Long: 100 requests per hour
- **Applied:** Global rate limiting on all endpoints
- **Impact:** Prevents brute force attacks

### 4. ✅ Replaced console.log with Proper Logger (HIGH PRIORITY)
- **Files:**
  - `apps/backend/src/auth/jwt.strategy.ts`
  - `apps/backend/src/main.ts`
- **Changed:** All console.log/console.error replaced with Logger/PinoLoggerService
- **Impact:** Structured logging, no sensitive data leakage

### 5. ✅ Added Environment Variable Validation (HIGH PRIORITY)
- **Files:**
  - `apps/backend/src/config/env.validation.ts` (NEW)
  - `apps/backend/src/app.module.ts`
- **Installed:** joi@18.0.2
- **Validates:**
  - DATABASE_URL (required, valid URI)
  - JWT_SECRET or NEXTAUTH_SECRET (required, min 32 chars)
  - FRONTEND_URL (required, valid URI)
  - NODE_ENV (development/production/test)
- **Impact:** Application fails to start with clear error if misconfigured

### 6. ✅ Added Audit Logging (MEDIUM PRIORITY)
- **Files:**
  - `apps/backend/src/auth/auth.service.ts`
  - `apps/backend/src/users/users.service.ts`
- **Events Logged:**
  - LOGIN_ATTEMPT, LOGIN_SUCCESS, LOGIN_FAILED (with reason)
  - SIGNUP_ATTEMPT, SIGNUP_SUCCESS, SIGNUP_FAILED (with reason)
  - OAUTH_SYNC_ATTEMPT, OAUTH_USER_CREATED, OAUTH_USER_UPDATED
  - ACCOUNT_DELETED
- **Format:** Structured JSON with event, userId, email, timestamp, reason
- **Impact:** Full audit trail for security monitoring

### 7. ✅ Fixed NextAuth Fallback Secret (HIGH PRIORITY)
- **File:** `apps/web/src/lib/auth.ts`
- **Fix:** Application now fails fast if NEXTAUTH_SECRET is not set
- **Removed:** All console.error calls that leak sensitive data
- **Impact:** No weak secrets in production

### 8. ✅ Updated Environment Examples (MEDIUM PRIORITY)
- **Files:**
  - `apps/backend/.env.example`
  - `apps/web/.env.example`
- **Added:**
  - Clear security warnings
  - Instructions for generating secure secrets
  - Minimum length requirements (32 characters)
  - Production vs development examples
- **Impact:** Better documentation for deployment

---

## Environment Setup Required ⚠️

Before deployment, you MUST set these environment variables:

### Backend (.env)

```bash
# Generate secrets using:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Server
PORT=4000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@host:5432/glassbox

# Authentication (CRITICAL - must match frontend)
JWT_SECRET=<YOUR_32_CHAR_SECRET_HERE>
NEXTAUTH_SECRET=<YOUR_32_CHAR_SECRET_HERE>  # Must match JWT_SECRET
JWT_EXPIRATION=604800

# Frontend URL (CORS)
FRONTEND_URL=https://your-domain.com
```

### Frontend (.env.local or .env.production)

```bash
# Backend API
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# NextAuth
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<YOUR_32_CHAR_SECRET_HERE>  # Must match backend

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

---

## Pre-Deployment Checklist

### 1. Environment Variables ⚠️ REQUIRED

- [ ] Generate strong secrets (min 32 characters)
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Set `JWT_SECRET` in backend .env
- [ ] Set `NEXTAUTH_SECRET` in backend .env (must match JWT_SECRET)
- [ ] Set `NEXTAUTH_SECRET` in frontend .env (must match backend)
- [ ] Verify JWT_SECRET === NEXTAUTH_SECRET (backend and frontend)
- [ ] Set `DATABASE_URL` with production database
- [ ] Set `FRONTEND_URL` with production domain (HTTPS)
- [ ] Set `NEXT_PUBLIC_API_URL` with backend API URL (HTTPS)
- [ ] Set `NEXTAUTH_URL` with frontend domain (HTTPS)
- [ ] Set Google OAuth credentials (production app)
- [ ] Verify `.env` files are in `.gitignore`

### 2. Database Setup

- [ ] PostgreSQL database created
- [ ] Run Prisma migrations
  ```bash
  cd apps/backend
  npx prisma migrate deploy
  ```
- [ ] Verify database connection
- [ ] Set up database backups

### 3. HTTPS/SSL Setup

- [ ] SSL certificate installed (Let's Encrypt, AWS ACM, etc.)
- [ ] HTTPS enabled on backend API
- [ ] HTTPS enabled on frontend
- [ ] HTTP → HTTPS redirect configured
- [ ] Verify Helmet HSTS headers work

### 4. Google OAuth Configuration

- [ ] Create production OAuth app in Google Cloud Console
- [ ] Add authorized redirect URI: `https://your-domain.com/api/auth/callback/google`
- [ ] Update GOOGLE_CLIENT_ID in frontend .env
- [ ] Update GOOGLE_CLIENT_SECRET in frontend .env
- [ ] Test OAuth flow end-to-end

### 5. Security Testing

- [ ] Test authentication flow (signup, login, logout)
- [ ] Test OAuth flow (Google Sign-In)
- [ ] Verify rate limiting works (try >3 requests/second)
- [ ] Test JWT expiration (wait 7 days or reduce expiry for testing)
- [ ] Verify security headers present (check with browser DevTools)
- [ ] Test CORS (verify only frontend domain allowed)
- [ ] Attempt SQL injection (should be blocked by Prisma)
- [ ] Attempt XSS (should be blocked by Helmet CSP)

### 6. Logging & Monitoring

- [ ] Verify Pino logger outputs JSON in production
- [ ] Set up log aggregation service (optional but recommended)
  - Options: Datadog, Cloudwatch, Logtail, etc.
- [ ] Configure log retention policy
- [ ] Set up alerts for:
  - Multiple failed login attempts
  - Rate limit exceeded
  - 5xx errors on critical endpoints
  - Unusual access patterns

### 7. Build & Deploy

- [ ] Build backend
  ```bash
  cd apps/backend
  pnpm run build
  ```
- [ ] Build frontend
  ```bash
  cd apps/web
  pnpm run build
  ```
- [ ] Test production builds locally
- [ ] Deploy backend to hosting service
- [ ] Deploy frontend to hosting service (Vercel, Netlify, etc.)
- [ ] Verify deployments

### 8. Post-Deployment Verification

- [ ] Test frontend loads (HTTPS)
- [ ] Test backend API responds (HTTPS)
- [ ] Test authentication end-to-end
- [ ] Test Google OAuth end-to-end
- [ ] Verify API documentation accessible (`/api` endpoint)
- [ ] Check security headers in production
  ```bash
  curl -I https://api.your-domain.com
  ```
- [ ] Monitor logs for errors
- [ ] Monitor rate limit metrics

---

## Security Testing Commands

### Check Security Headers
```bash
# Backend API
curl -I https://api.your-domain.com

# Should see:
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
```

### Test Rate Limiting
```bash
# Send 5 rapid requests (should see 429 Too Many Requests after 3)
for i in {1..5}; do
  curl -w "\n%{http_code}\n" https://api.your-domain.com/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test"}'
done
```

### Verify Environment Variables
```bash
# Backend - verify secrets are set and valid
cd apps/backend
node -e "
const crypto = require('crypto');
const jwt = process.env.JWT_SECRET;
const nextauth = process.env.NEXTAUTH_SECRET;

console.log('JWT_SECRET length:', jwt ? jwt.length : 'NOT SET');
console.log('NEXTAUTH_SECRET length:', nextauth ? nextauth.length : 'NOT SET');
console.log('Secrets match:', jwt === nextauth ? '✅ YES' : '❌ NO');
console.log('JWT_SECRET >= 32 chars:', jwt && jwt.length >= 32 ? '✅ YES' : '❌ NO');
"
```

---

## Rollback Plan

If issues are found after deployment:

1. **Authentication Issues:**
   - Verify JWT_SECRET and NEXTAUTH_SECRET match
   - Check cookie settings (secure, sameSite)
   - Verify CORS configuration (FRONTEND_URL)

2. **Rate Limiting Too Strict:**
   - Adjust throttle limits in `app.module.ts`
   - Redeploy backend

3. **Critical Security Issue:**
   - Take app offline immediately
   - Fix issue
   - Re-test in staging
   - Redeploy

---

## Production Monitoring Checklist

### Daily
- [ ] Review authentication logs for failed login attempts
- [ ] Check error rates (4xx, 5xx)
- [ ] Monitor rate limit hits

### Weekly
- [ ] Review audit logs for suspicious activity
- [ ] Check database backup status
- [ ] Review SSL certificate expiration

### Monthly
- [ ] Update dependencies (`pnpm update`)
- [ ] Review and rotate secrets if needed
- [ ] Security audit review
- [ ] Penetration testing (if applicable)

---

## Security Contact

For security issues or questions:
- Email: security@your-domain.com
- Report vulnerabilities: security@your-domain.com

---

## Additional Security Recommendations

### Short-term (Within 1 Month)

1. **Implement Refresh Tokens**
   - Short-lived access tokens (15 minutes)
   - Long-lived refresh tokens (7 days)
   - Stored in separate httpOnly cookie

2. **Add Token Blacklist (Redis)**
   - Invalidate tokens on logout
   - Invalidate all tokens on password change

3. **Implement CSP in Next.js**
   - Create middleware.ts
   - Add Content-Security-Policy headers

4. **Add CSRF Protection**
   - Add CSRF tokens to state-changing operations
   - Consider @nestjs/csrf

### Long-term (Within 3 Months)

1. **Two-Factor Authentication (2FA)**
2. **Automated Security Scanning**
   - Snyk for dependencies
   - SonarQube for code quality
3. **Regular Penetration Testing**
4. **GDPR Compliance Features**
   - Data export
   - Right to deletion

---

## Status Summary

✅ **Ready for Deployment** (after environment setup)

All critical security fixes have been applied. The application will fail to start if required environment variables are missing or invalid.

**Next Step:** Set up production environment variables and follow deployment checklist above.

---

**Last Updated:** 2026-02-06
**Reviewed By:** Claude Code Security Team
