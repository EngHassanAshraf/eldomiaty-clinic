# Eldomiaty Clinic

Eldomiaty Clinic is a bilingual (Arabic/English), RTL-first web application for a private OB/GYN and IVF clinic. The app combines a public marketing site with a member portal where authenticated users can view medical PDF content, request access to paid materials, and submit payment verification requests.

The current workspace contains the Next.js application, Prisma schema, and server-side API routes. The project is designed to run with a PostgreSQL database and Supabase Storage, with custom JWT-based authentication rather than Supabase Auth.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Development Workflow](#development-workflow)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Authentication and Configuration Notes](#authentication-and-configuration-notes)

## Project Overview

This project serves two primary audiences:

1. Public visitors who want to learn about the clinic, services, branches, and contact information.
2. Registered members who can access medical files and submit payment requests for subscription activation.

The admin experience is available to users with the ADMIN role and includes dashboards for:

- viewing users
- reviewing payment requests
- managing payment methods
- uploading and managing medical files

## Features

### Public-facing site
- Marketing homepage with hero, services, stats, about, branches, testimonials, and contact sections
- RTL and bilingual UI with Arabic as the default locale
- SEO metadata via generated sitemap and robots rules
- WhatsApp and contact call-to-action components

### Member portal
- User registration and login
- Authenticated access to medical files
- Paid content gating for premium materials
- Payment request flow with screenshot upload and admin review
- Maintenance mode support via system settings

### Admin dashboard
- User management table
- Payment request review flow
- Payment method configuration
- File upload, edit, and deletion
- Audit logging for important actions

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| ORM | Prisma |
| Database | PostgreSQL via Supabase |
| File storage | Supabase Storage |
| Auth | Custom JWT authentication with httpOnly cookies |
| Testing | Vitest + fast-check |
| Package manager | npm (works with package.json scripts) |

## Prerequisites

Before getting started, make sure you have:

- Node.js 20 LTS or newer
- npm
- A PostgreSQL database (recommended: Supabase Postgres)
- A Supabase project for storage and database access
- A secure JWT secret for local development

## Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd eldomiaty-clinic
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Fill in the required environment variables.

5. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The app should be available at http://localhost:3000.

## Environment Variables

The project expects the following environment variables. A template is available in [.env.example](.env.example).

### Required

```env
DATABASE_URL="..."
DIRECT_URL="..."
SUPABASE_URL="..."
SUPABASE_SERVICE_ROLE_KEY="..."
JWT_SECRET="..."
```

### Recommended / optional

```env
SUPABASE_PUBLISHABLE_KEY="..."
SUPABASE_STORAGE_BUCKET="clinic-files"
SUPABASE_PAYMENT_BUCKET="clinic-files"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN_DAYS="7"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Notes
- `DATABASE_URL` is used by Prisma for application queries.
- `DIRECT_URL` is intended for migrations.
- `SUPABASE_SERVICE_ROLE_KEY` is used server-side for uploads and signed URLs.
- `JWT_SECRET` is required for access-token signing and middleware validation.

## Database Setup

This repository already includes a Prisma schema and migration history under [prisma](prisma).

### Recommended setup flow

1. Create or connect a PostgreSQL database.
2. Set `DATABASE_URL` and `DIRECT_URL` in your environment.
3. Run Prisma migrations:
   ```bash
   npx prisma migrate deploy
   ```

4. If you are working locally and want to create migrations from schema changes:
   ```bash
   npx prisma migrate dev
   ```

5. Seed the database if needed:
   ```bash
   npm run db:seed
   ```

### Database model overview
The schema includes:
- users and user sessions
- medical files and preview files
- payment requests
- payment method settings
- access logs
- audit logs
- system settings

## Development Workflow

### Local development
- Run the app with `npm run dev`.
- Use the browser to test public pages, auth flows, file access, and admin routes.
- Any server-side API work should be implemented under [src/app/api](src/app/api).

### Typical onboarding flow
1. Create `.env.local` from the example file.
2. Install dependencies.
3. Connect Supabase and Prisma to a database.
4. Start the dev server.
5. Register a user, log in, and test file access and payment request submission.
6. If you need admin access, create or promote a user in the database or through your local setup.

## Available Scripts

From [package.json](package.json):

```bash
npm run dev        # start Next.js in development mode
npm run build      # production build
npm run start      # run the production build locally
npm run lint       # run Next.js linting
npm test           # run Vitest test suite
npm run db:seed    # seed the database via Prisma
```

## Project Structure

```text
src/
  app/                # App Router pages and API routes
    api/              # Route handlers for auth, files, payments, settings, and users
    dashboard/        # Admin dashboard UI
    files/            # Public and member file pages
    login/            # Login page
    payment/          # Payment request and success flow
    register/         # Registration page
  components/         # Reusable UI components for the marketing site and shared UI
  contexts/           # Auth context provider
  lib/                # Shared business logic, API clients, auth helpers, storage integrations
  middleware.ts      # Route protection and maintenance mode handling
prisma/               # Prisma schema and migrations
public/               # Static assets
```

## Deployment

The project is prepared for deployment as a Next.js application, and Vercel configuration is already present in [vercel.json](vercel.json).

### Deployment checklist
- Configure production environment variables in your hosting provider.
- Ensure the database and Supabase connection strings point to production resources.
- Make sure Supabase Storage buckets exist and are accessible with the service role key.
- Build and verify the project with:
  ```bash
  npm run build
  ```

### Notes
- The app uses server-side cookies for authentication, so deployment must preserve cookie behavior and domain settings correctly.
- The middleware and route handlers rely on `JWT_SECRET` in runtime environment variables.

## Authentication and Configuration Notes

### Authentication model
- Access tokens are issued and verified on the server.
- Refresh tokens are stored in database-backed sessions and sent via httpOnly cookies.
- Authentication is enforced through route handlers and middleware.

### Authorization model
- Public routes are open to unauthenticated visitors.
- Files and payment routes require a valid session.
- The dashboard and admin-only actions require the ADMIN role.

### Maintenance mode
The app includes a maintenance-mode setting that can redirect non-admin users to a dedicated maintenance page. The setting is read from the database through the system settings model.

### Storage behavior
Medical PDFs and payment screenshots are stored in Supabase Storage. The application generates signed URLs for secure file access.

## Additional Notes

- The repository documentation in [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md) and [docs/NEW_ARCHITECTURE.md](docs/NEW_ARCHITECTURE.md) provides further architectural context and migration notes.
- Some older documentation refers to a removed backend service; the current workspace is focused on the Next.js application and its Prisma-backed API routes.
