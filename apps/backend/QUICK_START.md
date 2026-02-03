# Quick Start - Backend Authentication

## Start Server

```bash
cd apps/backend
pnpm run build
node dist/main.js
```

Server will start on http://localhost:4000

## Test Authentication

### 1. Create a User (Public Endpoint)

```bash
curl -X POST http://localhost:4000/users/sync \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","name":"Your Name"}'
```

### 2. Generate Test Token

```bash
node test-token.js
```

### 3. Test Protected Endpoint

```bash
curl http://localhost:4000/users/me \
  -H "Authorization: Bearer <token-from-step-2>"
```

## Documentation

- **Authentication Flow:** `AUTH_FLOW.md`
- **Setup Guide:** `AUTH_SETUP.md`
- **Quick Reference:** `AUTH_SUMMARY.md`
- **Test Results:** `AUTH_TEST_RESULTS.md`
- **API Docs:** http://localhost:4000/api

## Environment Variables

Required in `.env`:

```bash
DATABASE_URL=postgresql://doyeong@localhost:5432/glassbox
JWT_SECRET=dev-secret-key-minimum-32-characters-long-for-testing
NEXTAUTH_SECRET=dev-secret-key-minimum-32-characters-long-for-testing
PORT=4000
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/users/sync` | None | Create/update user |
| GET | `/users/me` | JWT | Get user profile |
| GET | `/api` | None | Swagger docs |

## Next Steps

1. ✅ Backend authentication is complete
2. ⏳ Configure frontend NextAuth.js
3. ⏳ Test end-to-end authentication flow

See `.claude/rules/backend-implementation.md` for frontend setup guide.
