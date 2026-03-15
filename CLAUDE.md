# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # prisma generate + next build
npm run check        # next lint + tsc --noEmit
npm run typecheck    # tsc --noEmit
npm run lint         # next lint
npm run lint:fix     # next lint --fix
npm run format:write # prettier --write

# Database
npm run db:generate  # prisma migrate dev (create + apply migration)
npm run db:migrate   # prisma migrate deploy (apply existing migrations)
npm run db:push      # prisma db push (push schema without migration)
npm run db:studio    # open Prisma Studio
npm run db-seed      # tsx prisma/seed.ts (seed with faker data)
```

## Architecture

T3 Stack: **Next.js 15 App Router + tRPC + Prisma + NextAuth v5 + Tailwind CSS v4**. Database is **Neon Postgres** (serverless), accessed via `@prisma/adapter-neon`.

### Data Model

```
User → Base → Table → Field   (column definitions, FieldType: TEXT | NUMBER)
                     → Record  (rows; all cell values in a single JSON blob: { fieldId: value })
                     → View    (saved filters/sorts/hidden fields as JSON arrays)
```

Generated Prisma client outputs to `generated/prisma/` (not the default location). Import as `import { PrismaClient } from "../../generated/prisma"`. Zod schemas are auto-generated to `generated/zod/` via `prisma-zod-generator`.

### tRPC API

Routers live in `src/server/api/routers/`: `base`, `table`, `field`, `record`, `view`. All are registered in `src/server/api/root.ts`.

- `publicProcedure` — no auth required (reads are public)
- `protectedProcedure` — requires `ctx.session.user` (writes require auth)

Dev adds a random 100–500ms delay to all procedures to simulate network latency.

### Record storage & querying

Records store all cell values as a JSONB blob (`data` column, GIN-indexed). Filtering, sorting, and pagination use raw SQL via `Prisma.sql` to operate on JSONB fields. The `record.list` procedure uses **keyset/cursor pagination** on `Record.order` (`@@unique([tableId, order])`).

The frontend uses `useInfiniteQuery` with 5000-row pages. A separate `record.count` query fetches the total first so the virtualizer can size the scrollbar immediately, preventing it from jumping as pages load.

### Frontend state

`BaseView` is the top-level client component for `/base/[baseId]`. All view state (active table, active view, search, filters, sorts) is stored in **URL search params** so the URL is always shareable/bookmarkable. `hiddenFieldIds` is the only piece of state kept in React state (not URL) because it's local UI state.

`ViewSidebar` auto-saves the active view's config (filters/sorts/hidden fields) to the DB with a 600ms debounce on changes. When switching views, it flushes the current view first, then fetches the new view's config with `staleTime: 0` to bypass cache.

`TableGrid` uses `@tanstack/react-virtual` for row virtualization. Optimistic updates are applied via `utils.record.list.setInfiniteData` on cell edits, with rollback on error.

### Types

Shared Zod schemas and TypeScript types for the full domain live in `src/types/`. All input/output schemas for tRPC procedures are defined here and imported by both routers and frontend components. The central export is `src/types/index.ts`.

### Environment variables

Validated at startup via `@t3-oss/env-nextjs` in `src/env.js`. Required: `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. `AUTH_SECRET` is optional in dev, required in production.

### Auth

NextAuth v5 (beta) with Google OAuth provider. Config in `src/server/auth/config.ts`, Prisma adapter used for session/account storage.
