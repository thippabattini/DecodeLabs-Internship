# Project 3: Student Course Enrollment API

DecodeLabs Industrial Training Kit (Batch 2026) — Database Integration project.

**Stack:** Node.js + Express + PostgreSQL + Prisma ORM

## Project Structure

```
├── prisma/
│   ├── schema.prisma          # Pillar 1 — data models
│   ├── migrations/            # SQL migrations with CHECK constraints
│   └── seed.js                # Sample data
├── src/
│   ├── lib/prisma.js          # Pillar 2 — database connection
│   ├── routes/                # Pillar 3 — CRUD endpoints (coming next)
│   ├── middleware/
│   ├── app.js
│   └── server.js
├── docker-compose.yml         # Local PostgreSQL
└── .env.example
```

## Four Pillars Roadmap

| Pillar | Topic | Status |
|--------|-------|--------|
| 1 | Schema Design | Schema + migration ready |
| 2 | Integration & Connection | Prisma client configured |
| 3 | CRUD & RESTful HTTP | Full REST API implemented |
| 4 | Integrity & Security | CHECK/UNIQUE/FK in DB — review in Pillar 4 |

## Prerequisites

- Node.js 18+
- Docker Desktop (for PostgreSQL) **or** a local PostgreSQL instance

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
copy .env.example .env
```

### 3. Start PostgreSQL

```bash
docker compose up -d
```

### 4. Run migrations & generate Prisma client

```bash
npm run db:generate
npx prisma migrate deploy
```

### 5. (Optional) Seed sample data

```bash
npm run db:seed
```

### 6. Start the API

```bash
npm run dev
```

Visit `http://localhost:3000/health` to verify the server is running.

## API Routes

| Method | Endpoint | SQL | Operation |
|--------|----------|-----|-----------|
| POST | `/api/students` | INSERT | Create student |
| GET | `/api/students` | SELECT | List students |
| GET | `/api/students/:id` | SELECT | Get student |
| PATCH | `/api/students/:id` | UPDATE | Update student |
| DELETE | `/api/students/:id` | DELETE | Delete student |
| PUT | `/api/students/:id/profile` | INSERT/UPDATE | Upsert profile |
| GET | `/api/students/:id/courses` | SELECT+JOIN | Student's courses |
| POST | `/api/courses` | INSERT | Create course |
| GET | `/api/courses` | SELECT | List courses |
| GET | `/api/courses/:id` | SELECT | Get course |
| PATCH | `/api/courses/:id` | UPDATE | Update course |
| DELETE | `/api/courses/:id` | DELETE | Delete course |
| GET | `/api/courses/:id/students` | SELECT+JOIN | Course's students |
| POST | `/api/enrollments` | INSERT | Enroll student |
| GET | `/api/enrollments` | SELECT | List enrollments |
| PATCH | `/api/enrollments/:id` | UPDATE | Update grade |
| DELETE | `/api/enrollments/:id` | DELETE | Unenroll |

Test all operations: `npm run pillar3:demo` (server must be running)

## Schema Relationships

- **One-to-One:** `Student` ↔ `StudentProfile`
- **One-to-Many:** `Student` → `Enrollment`, `Course` → `Enrollment`
- **Many-to-Many:** `Student` ↔ `Enrollment` ↔ `Course` (junction table)

## Useful Commands

```bash
npm run dev          # Start with hot reload
npm run db:studio    # Open Prisma Studio (visual DB browser)
npm run db:migrate   # Create new migration during development
```
