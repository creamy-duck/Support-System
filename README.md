# Support Ticket System

A production-ready support ticket management system built with Next.js 14 App Router, MongoDB, and NextAuth.js.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js v4 (JWT sessions)
- **Validation**: Zod
- **Containerization**: Docker + Docker Compose

## Features

- **Role-Based Access Control**: Three roles — `user`, `support`, `admin`
- **Ticket Management**: Create, view, update status, assign tickets
- **Reply System**: Public and internal (staff-only) replies
- **Audit Log**: Full history of ticket changes (status, assignment, replies)
- **Rate Limiting**: In-memory rate limiting for ticket creation
- **Admin Panel**: User management and role assignment
- **Responsive UI**: Clean, modern interface with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

### Docker Compose

```bash
docker-compose up -d
```

This starts the app and MongoDB together.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/support-system` |
| `NEXTAUTH_SECRET` | NextAuth JWT secret | Required in production |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |

## Architecture

```
├── app/                    # Next.js App Router pages and API routes
│   ├── (auth)/             # Authentication pages (login, register)
│   ├── (dashboard)/        # Protected dashboard pages
│   ├── admin/              # Admin panel pages
│   └── api/                # REST API endpoints
├── components/             # React components
│   ├── admin/              # Admin-specific components
│   ├── layout/             # Layout components (Navbar)
│   ├── tickets/            # Ticket-related components
│   └── ui/                 # Reusable UI components
├── lib/                    # Utilities (db, auth, errors, logger, rateLimit)
├── server/                 # Server-side logic
│   ├── auth/               # Auth permissions helpers
│   ├── models/             # Mongoose models
│   ├── repositories/       # Data access layer
│   └── services/           # Business logic layer
├── types/                  # TypeScript type definitions
└── validation/             # Zod validation schemas
```

## API Endpoints

| Method | Path | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/signin` | Sign in | Public |
| `GET` | `/api/tickets` | List tickets | Required |
| `POST` | `/api/tickets` | Create ticket | Required |
| `GET` | `/api/tickets/[id]` | Get ticket | Required |
| `PATCH` | `/api/tickets/[id]/status` | Update status | Support/Admin |
| `PATCH` | `/api/tickets/[id]/assign` | Assign ticket | Support/Admin |
| `GET` | `/api/tickets/[id]/replies` | Get replies | Required |
| `POST` | `/api/tickets/[id]/replies` | Add reply | Required |
| `GET` | `/api/tickets/[id]/audit` | Get audit log | Support/Admin |
| `GET` | `/api/users` | List users | Admin |
| `PATCH` | `/api/users/[id]/role` | Update user role | Admin |

## Building for Production

```bash
npm run build
npm start
```
