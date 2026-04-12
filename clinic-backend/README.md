# Clinic Backend

NestJS REST API for the Eldomiaty Clinic platform.

## Setup

```bash
npm install
cp .env.example .env
# Fill in .env values

npx prisma generate
npx prisma migrate dev --name init

# Run dev server
npm run start:dev
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /auth/register | None | Register |
| POST | /auth/login | None | Login |
| POST | /auth/refresh | None | Refresh tokens |
| GET | /users | ADMIN | List users |
| GET | /users/:id | ADMIN | Get user |
| POST | /payments/checkout | JWT | Create checkout |
| POST | /payments/webhook | Stripe sig | Webhook |
| GET | /payments | ADMIN | List payments |
| POST | /files | ADMIN | Upload file |
| GET | /files | Public | List files |
| GET | /files/:id | JWT | Get file |
| GET | /files/:id/preview | JWT | Preview URL |
| GET | /files/:id/full-access | JWT+Paid | Full URL |
| PATCH | /files/:id | ADMIN | Update file |
| DELETE | /files/:id | ADMIN | Delete file |
