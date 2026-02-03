# Manual Authentication (Email/Password)

## Overview

The backend now supports **two authentication methods**:

1. **Google OAuth** (via NextAuth.js in frontend)
2. **Email/Password** (manual signup/login)

Users can sign up with either method and authenticate accordingly.

---

## API Endpoints

### 1. Signup (Create Account)

**Endpoint:** `POST /auth/signup`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Response (201 Created):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": null,
    "createdAt": "2026-02-03T12:47:45.588Z"
  },
  "accessToken": "eyJhbGci...",
  "tokenType": "Bearer",
  "expiresIn": 604800
}
```

**Errors:**
- `409 Conflict` - Email already registered
- `400 Bad Request` - Invalid password format

---

### 2. Login

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": null,
    "createdAt": "2026-02-03T12:47:45.588Z"
  },
  "accessToken": "eyJhbGci...",
  "tokenType": "Bearer",
  "expiresIn": 604800
}
```

**Errors:**
- `401 Unauthorized` - Invalid credentials
- `401 Unauthorized` - Account uses Google Sign-In (no password set)

---

## Security Features

### Password Hashing
- **Algorithm:** bcrypt
- **Salt Rounds:** 10
- **Hash Example:** `$2b$10$l1ZBGq0FzOjpA1.F/HARwuD...`

### Password Validation
```typescript
✅ Minimum 8 characters
✅ At least one uppercase letter (A-Z)
✅ At least one lowercase letter (a-z)
✅ At least one number (0-9)
✅ Maximum 100 characters
```

### Token Security
- **Type:** JWT (JSON Web Token)
- **Expiration:** 7 days
- **Algorithm:** HS256
- **Payload:** `{ sub: userId, email }`

---

## Database Schema

### User Model (Updated)

```prisma
model User {
  id         String      @id @default(uuid())
  email      String      @unique
  password   String?     // Hashed password (null for OAuth users)
  name       String?
  picture    String?     // Google profile picture URL
  googleId   String?     @unique
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  portfolios Portfolio[]
}
```

**Key Points:**
- `password` is **nullable** - OAuth users don't have passwords
- Passwords are always **hashed** with bcrypt
- Users with `googleId` typically have `password = null`

---

## Authentication Flow

### Manual Signup Flow

```
1. User submits email + password + name
   ↓
2. Backend validates password requirements
   ↓
3. Check if email already exists
   ↓
4. Hash password with bcrypt
   ↓
5. Create user in database
   ↓
6. Generate JWT token
   ↓
7. Return user + accessToken
```

### Manual Login Flow

```
1. User submits email + password
   ↓
2. Backend finds user by email
   ↓
3. Check if user has password (not OAuth-only)
   ↓
4. Compare password with bcrypt hash
   ↓
5. Generate JWT token
   ↓
6. Return user + accessToken
```

### Using the Token

```
1. Client stores accessToken (localStorage/cookie)
   ↓
2. Client includes token in API requests
   Authorization: Bearer <accessToken>
   ↓
3. Backend validates JWT signature
   ↓
4. Extract userId from token payload
   ↓
5. Allow access to protected resources
```

---

## Example Usage

### Signup
```bash
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123",
    "name": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Access Protected Route
```bash
curl http://localhost:4000/users/me \
  -H "Authorization: Bearer eyJhbGci..."
```

---

## Differences Between OAuth and Manual Auth

| Feature | Google OAuth | Manual (Email/Password) |
|---------|-------------|------------------------|
| **Endpoint** | `/users/sync` (NextAuth) | `/auth/signup`, `/auth/login` |
| **Password** | ❌ No password | ✅ Hashed password |
| **Google ID** | ✅ Yes | ❌ No |
| **Profile Picture** | ✅ From Google | ❌ No |
| **Token** | JWT from NextAuth | JWT from backend |
| **Logout** | NextAuth handles | Token expiration |

---

## Hybrid Users

Users **cannot** have both authentication methods simultaneously:

### OAuth User (Google)
```json
{
  "email": "user@gmail.com",
  "password": null,          // ❌ No password
  "googleId": "12345...",
  "picture": "https://..."
}
```

### Manual User (Email/Password)
```json
{
  "email": "user@example.com",
  "password": "$2b$10$...",  // ✅ Hashed password
  "googleId": null,
  "picture": null
}
```

### Login Attempt Behavior
- **OAuth user tries manual login:** ❌ Error: "This account uses Google Sign-In"
- **Manual user tries OAuth:** ✅ Works (creates separate account if different email)

---

## Security Considerations

### ✅ Implemented

1. **Password Hashing:** bcrypt with 10 salt rounds
2. **Password Validation:** Strong password requirements
3. **JWT Tokens:** Signed with secret key
4. **Input Validation:** class-validator DTOs
5. **Error Messages:** Generic "Invalid credentials" (no email enumeration)
6. **Unique Emails:** Prevents duplicate accounts

### ⚠️ Missing (Recommended for Production)

1. **Rate Limiting:** Prevent brute force attacks
2. **Account Lockout:** Lock account after X failed attempts
3. **Email Verification:** Confirm email ownership
4. **Password Reset:** "Forgot password" functionality
5. **2FA/MFA:** Two-factor authentication
6. **Session Management:** Track active sessions
7. **Password History:** Prevent password reuse

---

## Frontend Integration

### Example: React Login Component

```typescript
async function login(email: string, password: string) {
  const response = await fetch('http://localhost:4000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const { user, accessToken } = await response.json();

  // Store token
  localStorage.setItem('accessToken', accessToken);

  return user;
}
```

### Example: API Client with Token

```typescript
async function apiClient(endpoint: string, options = {}) {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`http://localhost:4000${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });

  return response.json();
}

// Usage
const user = await apiClient('/users/me');
const portfolios = await apiClient('/portfolios');
```

---

## Testing

### Test Signup
```bash
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123","name":"Test User"}'
```

### Test Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'
```

### Test Wrong Password
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"WrongPass"}'

# Expected: 401 Unauthorized
```

### Test Duplicate Signup
```bash
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123","name":"Test"}'

# Expected: 409 Conflict
```

---

## Migration Notes

### Existing OAuth Users
- ✅ Unaffected - can still login with Google
- ✅ `password` field is `null`
- ✅ No manual login possible

### Adding Password to OAuth User
To allow OAuth users to also login manually, you would need to:
1. Create `/auth/set-password` endpoint
2. Verify user is authenticated via OAuth
3. Hash and store password
4. Update `password` field

---

## Summary

✅ **Manual authentication is now fully functional:**
- Email/password signup
- Email/password login
- Secure password hashing (bcrypt)
- Strong password validation
- JWT token generation
- Works alongside Google OAuth

✅ **Both authentication methods coexist:**
- OAuth users continue working
- Manual users can signup/login
- Same JWT validation for all users

⚠️ **Next steps for production:**
- Add rate limiting
- Add email verification
- Add password reset
- Add 2FA support
- Add session management

---

## Environment Variables

No new environment variables needed. Uses existing:

```bash
JWT_SECRET=your-secret-key
NEXTAUTH_SECRET=same-as-jwt-secret
```

---

## API Documentation

Full API docs available at: http://localhost:4000/api

New endpoints added:
- `POST /auth/signup`
- `POST /auth/login`
