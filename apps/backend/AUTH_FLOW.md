# Glassbox Authentication Flow

## Overview

Glassbox uses Google OAuth for authentication with JWT tokens for API authorization.

**Architecture:** Browser → Next.js (OAuth) → Nest.js (JWT Validation) → Database

**Flow:**
1. User clicks "Sign in with Google" on frontend
2. NextAuth.js handles Google OAuth flow
3. On successful login, NextAuth calls `/users/sync` endpoint
4. Backend creates/updates user in database
5. NextAuth issues JWT token to frontend
6. Frontend includes JWT token in API requests
7. Backend validates JWT token for protected routes

---

## Database Schema

### User Table

```prisma
model User {
  id         String      @id @default(uuid())
  email      String      @unique
  name       String?
  picture    String?     // Google profile picture URL
  googleId   String?     @unique
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  portfolios Portfolio[]

  @@map("users")
}
```

**Fields:**
- `id` - UUID primary key
- `email` - User's email from Google (unique)
- `name` - User's name from Google
- `picture` - Google profile picture URL
- `googleId` - Google user ID (for future use)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

**Relationships:**
- One user → Many portfolios

---

## Backend Implementation

### Directory Structure

```
apps/backend/src/
├── auth/
│   ├── jwt.strategy.ts        # JWT validation strategy
│   ├── jwt-auth.guard.ts      # JWT authentication guard
│   ├── public.decorator.ts    # Decorator for public routes
│   └── auth.module.ts         # Auth module configuration
├── users/
│   ├── dto/
│   │   └── sync-user.dto.ts   # User sync DTO
│   ├── users.service.ts       # User business logic
│   ├── users.controller.ts    # User API endpoints
│   └── users.module.ts        # Users module
└── prisma/
    ├── prisma.service.ts      # Prisma database service
    └── prisma.module.ts       # Prisma module (global)
```

---

## API Endpoints

### Public Endpoints (No Authentication Required)

#### POST /users/sync
Syncs user data from Google OAuth. Called by NextAuth during sign-in.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "image": "https://lh3.googleusercontent.com/...",
  "googleId": "1234567890"
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://lh3.googleusercontent.com/...",
  "googleId": "1234567890",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Protected Endpoints (JWT Required)

#### GET /users/me
Returns current user's profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://lh3.googleusercontent.com/...",
  "googleId": "1234567890",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## JWT Authentication

### How It Works

1. **Token Generation** - NextAuth.js generates JWT tokens on successful login
2. **Token Storage** - Frontend stores token (session cookie)
3. **API Requests** - Frontend includes token in Authorization header
4. **Token Validation** - Backend validates token using JWT strategy
5. **User Context** - Validated user info available in `req.user`

### JWT Payload

```typescript
{
  sub: "user-id",           // User ID
  email: "user@example.com", // User email
  iat: 1234567890,          // Issued at
  exp: 1234567890           // Expiration
}
```

### Global Guard

All routes are protected by default using APP_GUARD:

```typescript
{
  provide: APP_GUARD,
  useClass: JwtAuthGuard,
}
```

### Public Routes

Use `@Public()` decorator to mark routes as public:

```typescript
@Post('sync')
@Public()
async syncUser(@Body() dto: SyncUserDto) {
  // No authentication required
}
```

### Protected Routes

No decorator needed - protected by default:

```typescript
@Get('me')
async getProfile(@Request() req) {
  // req.user available - contains { userId, email }
  return this.usersService.findById(req.user.userId);
}
```

---

## Environment Variables

Required environment variables in `.env`:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/glassbox"

# JWT (Must match NEXTAUTH_SECRET from frontend)
JWT_SECRET=your-secret-key-here
NEXTAUTH_SECRET=your-secret-key-here

# Server
PORT=4000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

**Important:** `JWT_SECRET` and `NEXTAUTH_SECRET` must be the same value for token validation to work.

---

## Frontend Integration

The frontend (Next.js with NextAuth.js) is configured separately. See frontend documentation for:

1. Google OAuth setup in Google Cloud Console
2. NextAuth.js configuration
3. Session management
4. API client with token injection

**Key Point:** When user logs in with Google, NextAuth automatically calls `/users/sync` endpoint to create/update user in backend database.

---

## Testing Authentication

### 1. Create a user manually (for testing)

```bash
# Using Prisma Studio
npx prisma studio

# Or using SQL
psql $DATABASE_URL
INSERT INTO users (id, email, name)
VALUES (gen_random_uuid(), 'test@example.com', 'Test User');
```

### 2. Test sync endpoint

```bash
curl -X POST http://localhost:4000/users/sync \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "image": "https://example.com/image.jpg"
  }'
```

### 3. Test protected endpoint

First get a valid JWT token from NextAuth, then:

```bash
curl http://localhost:4000/users/me \
  -H "Authorization: Bearer <your-jwt-token>"
```

---

## Security Considerations

### Password-less Authentication
- No passwords stored in database
- Google handles all authentication
- Secure OAuth 2.0 flow

### JWT Security
- Tokens expire after 7 days
- Tokens signed with secret key
- Tokens validated on every request

### CORS Configuration
- Only frontend URL allowed
- Credentials enabled for cookies
- Prevents cross-origin attacks

### User Data Privacy
- Minimal data stored (email, name, picture)
- No sensitive information in JWT payload
- Cascade delete for user portfolios

---

## Troubleshooting

### "Unauthorized" errors

**Check:**
1. JWT_SECRET matches between frontend and backend
2. Token is included in Authorization header
3. Token format is "Bearer <token>"
4. Token has not expired

### User sync fails

**Check:**
1. Database is running
2. DATABASE_URL is correct
3. User table exists (run migrations)
4. Request body includes required fields (email)

### CORS errors

**Check:**
1. FRONTEND_URL environment variable is set
2. Frontend is running on correct port
3. Credentials are enabled in CORS config

---

## Next Steps

1. ✅ User schema created
2. ✅ Authentication flow implemented
3. ✅ JWT validation configured
4. ⏳ Run database migrations
5. ⏳ Configure frontend NextAuth.js
6. ⏳ Test end-to-end authentication

**Run migrations:**
```bash
cd apps/backend
npx prisma migrate dev --name add_auth
npx prisma generate
```
