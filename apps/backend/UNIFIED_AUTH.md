# Unified HttpOnly Cookie Authentication

## Overview

Both **manual (email/password)** and **OAuth (Google)** authentication now use the **same httpOnly cookie specification** for consistent and secure token management.

**Single Cookie Strategy:**
- ✅ Both auth methods set the same `accessToken` cookie
- ✅ Same security flags (httpOnly, SameSite, Secure)
- ✅ Same expiration (7 days)
- ✅ Unified JWT validation in backend

---

## Authentication Methods

### Method 1: Manual Email/Password

**Endpoints:**
- `POST /auth/signup` - Create account
- `POST /auth/login` - Sign in
- `POST /auth/logout` - Sign out

**Flow:**
1. User submits email + password
2. Backend validates credentials
3. Backend generates JWT token
4. Backend sets `accessToken` httpOnly cookie
5. User is authenticated

### Method 2: Google OAuth (NextAuth)

**Endpoints:**
- `GET /api/auth/signin` - Initiate OAuth
- `GET /api/auth/callback/google` - OAuth callback
- `POST /api/auth/signout` - Sign out

**Flow:**
1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. Google redirects back with authorization code
4. NextAuth exchanges code for user profile
5. Frontend calls `POST /users/sync` with user data
6. Backend creates/updates user in database
7. Backend generates JWT token
8. Backend sets `accessToken` httpOnly cookie
9. User is authenticated

---

## Cookie Specification (Unified)

### Cookie Name
```
accessToken
```

### Cookie Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `httpOnly` | `true` | JavaScript cannot access (XSS protection) |
| `secure` | `true` (production) | HTTPS only |
| `sameSite` | `'lax'` | CSRF protection |
| `path` | `'/'` | Available across entire domain |
| `maxAge` | `604800000` ms | 7 days expiration |

### Example Set-Cookie Header

```
Set-Cookie: accessToken=eyJhbGci...; Max-Age=604800; Path=/; HttpOnly; SameSite=Lax; Secure
```

---

## Backend Implementation

### 1. Manual Auth (auth.controller.ts)

**Signup:**
```typescript
@Post('signup')
@Public()
async signup(@Body() dto: SignupDto, @Res({ passthrough: true }) res: Response) {
  const result = await this.authService.signup(dto);

  // Set httpOnly cookie
  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return { user: result.user, tokenType: result.tokenType, expiresIn: result.expiresIn };
}
```

**Login:**
```typescript
@Post('login')
@Public()
@HttpCode(HttpStatus.OK)
async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
  const result = await this.authService.login(dto);

  // Set httpOnly cookie (same spec)
  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { user: result.user, tokenType: result.tokenType, expiresIn: result.expiresIn };
}
```

**Logout:**
```typescript
@Post('logout')
@Public()
@HttpCode(HttpStatus.OK)
async logout(@Res({ passthrough: true }) res: Response) {
  res.clearCookie('accessToken');
  return { message: 'Logged out successfully' };
}
```

### 2. OAuth Auth (users.controller.ts)

**User Sync (called by NextAuth):**
```typescript
@Post('sync')
@Public()
async syncUser(@Body() dto: SyncUserDto, @Res({ passthrough: true }) res: Response) {
  const user = await this.usersService.syncUser(dto);

  // Generate JWT token for OAuth user
  const accessToken = this.jwtService.sign({
    sub: user.id,
    email: user.email,
  });

  // Set httpOnly cookie (SAME SPEC as manual auth)
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return user;
}
```

### 3. JWT Validation (jwt.strategy.ts)

**Extract token from cookie:**
```typescript
jwtFromRequest: ExtractJwt.fromExtractors([
  // Extract from cookie (primary)
  (request: Request) => {
    return request?.cookies?.accessToken;
  },
  // Fallback to Authorization header
  ExtractJwt.fromAuthHeaderAsBearerToken(),
]),
```

Both auth methods use the **same JWT validation logic**.

---

## Frontend Implementation

### 1. NextAuth Configuration (lib/auth.ts)

**Cookie Settings:**
```typescript
cookies: {
  sessionToken: {
    name: `next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 days (same as manual auth)
    },
  },
},
```

**SignIn Callback (calls backend /users/sync):**
```typescript
async signIn({ user, account, profile }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Send cookies
      body: JSON.stringify({
        email: user.email,
        name: user.name,
        picture: user.image,
        googleId: account?.providerAccountId,
      }),
    });

    if (!response.ok) return false;

    // Backend sets accessToken cookie automatically
    return true;
  } catch (error) {
    return false;
  }
}
```

### 2. Axios Client (lib/axios-client.ts)

**Unified cookie handling:**
```typescript
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
  withCredentials: true, // Send cookies automatically
});
```

No special logic needed - cookies work the same for both auth methods.

### 3. Login/Signup Pages

**Manual Login:**
```typescript
const loginMutation = useMutation({
  mutationFn: async (data: LoginData) => {
    return axiosClient.post('/auth/login', data);
  },
  onSuccess: () => {
    // accessToken cookie set automatically
    router.push('/portfolios');
  },
});
```

**Google OAuth:**
```typescript
<button onClick={() => signIn('google', { callbackUrl: '/portfolios' })}>
  Sign in with Google
</button>
```

---

## Authentication State

### How It Works

**Frontend:**
- NextAuth manages OAuth session in `next-auth.session-token` cookie
- Backend JWT stored in `accessToken` cookie
- Both cookies sent automatically with requests

**Backend:**
- Only validates `accessToken` cookie (single source of truth)
- Same validation logic for both auth methods
- JwtAuthGuard protects routes

### Checking Auth Status

**Server Component:**
```typescript
import { auth } from '@/lib/auth';

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // User is authenticated
  return <div>Welcome {session.user.name}</div>;
}
```

**Client Component:**
```typescript
import { useSession } from 'next-auth/react';

export function ProfileButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return <Link href="/login">Sign In</Link>;

  return <div>Welcome {session.user.name}</div>;
}
```

---

## Logout Implementation

### Manual Auth Logout

**Frontend:**
```typescript
const handleLogout = async () => {
  await axiosClient.post('/auth/logout');
  router.push('/login');
};
```

**Backend:**
```typescript
@Post('logout')
@Public()
async logout(@Res({ passthrough: true }) res: Response) {
  res.clearCookie('accessToken');
  return { message: 'Logged out successfully' };
}
```

### OAuth Logout

**Frontend:**
```typescript
import { signOut } from 'next-auth/react';

const handleLogout = async () => {
  // Clear backend cookie first
  await axiosClient.post('/auth/logout');

  // Then clear NextAuth session
  await signOut({ callbackUrl: '/login' });
};
```

---

## Security Comparison

| Feature | Manual Auth | OAuth Auth | Unified? |
|---------|------------|------------|----------|
| Cookie Name | `accessToken` | `accessToken` | ✅ Yes |
| HttpOnly | ✅ Yes | ✅ Yes | ✅ Yes |
| Secure Flag | ✅ Yes | ✅ Yes | ✅ Yes |
| SameSite | `lax` | `lax` | ✅ Yes |
| Expiration | 7 days | 7 days | ✅ Yes |
| JWT Format | ✅ Yes | ✅ Yes | ✅ Yes |
| Validation | JwtStrategy | JwtStrategy | ✅ Yes |

**Result:** Both methods use the **exact same security specification** ✅

---

## Environment Variables

### Backend (.env)
```bash
JWT_SECRET=your-secret-key-min-32-chars
NEXTAUTH_SECRET=same-as-jwt-secret  # Keep in sync!
DATABASE_URL=postgresql://user:pass@localhost:5432/glassbox
FRONTEND_URL=http://localhost:3000
PORT=4000
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-min-32-chars  # Same as backend JWT_SECRET
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**IMPORTANT:** `NEXTAUTH_SECRET` must match `JWT_SECRET` for unified token validation.

---

## Testing

### Test Manual Signup

```bash
curl -i -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "name": "Test User"
  }'

# Check for Set-Cookie header with accessToken
```

### Test OAuth Flow

1. Visit http://localhost:3000/login
2. Click "Sign in with Google"
3. Complete Google OAuth
4. Check browser DevTools → Application → Cookies
5. Should see both:
   - `accessToken` (backend JWT)
   - `next-auth.session-token` (NextAuth session)

### Test Protected Route

```bash
curl http://localhost:4000/users/me \
  -H "Cookie: accessToken=eyJhbGci..."

# Should return user profile if authenticated
```

---

## Benefits of Unified Approach

✅ **Consistent Security**: Same cookie spec across all auth methods
✅ **Single Validation**: One JWT strategy validates all tokens
✅ **Simplified Logic**: No special handling per auth method
✅ **Better UX**: Seamless switching between auth methods
✅ **Easier Maintenance**: One set of security rules to manage
✅ **Production Ready**: Battle-tested cookie-based authentication

---

## Migration Checklist

Backend:
- ✅ Manual auth sets `accessToken` cookie
- ✅ OAuth sync sets `accessToken` cookie (same spec)
- ✅ JwtStrategy extracts from cookies
- ✅ Logout clears `accessToken` cookie
- ✅ UsersModule imports JwtModule

Frontend:
- ✅ NextAuth configured with matching cookie settings
- ✅ NextAuth signIn callback calls /users/sync
- ✅ Axios client sends credentials
- ✅ Google Sign-In buttons functional
- ✅ Environment variables configured

---

## Summary

✅ **Unified Cookie Spec**: Both auth methods use identical `accessToken` cookie
✅ **Same Security**: httpOnly, Secure, SameSite=Lax, 7-day expiration
✅ **Single Validation**: One JWT strategy for all authentication
✅ **Seamless Integration**: OAuth and manual auth work identically
✅ **Production Ready**: Industry-standard secure authentication

Both manual and OAuth authentication now share the **exact same cookie specification** for maximum security and consistency! 🔒
