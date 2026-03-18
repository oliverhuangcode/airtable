# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Brief (Spec Reference)

This is a **1:1 Airtable clone** built as a take-home project for Lyra. The original spec:

> Build an Airtable clone using T3 stack (Next.js + tRPC + Prisma + Postgres), deployed on Vercel. Focus on the main table view with columns and cells. UI must match Airtable 1:1. Google login + base/table creation. Dynamic columns (TEXT + NUMBER). Cell editing with arrow/tab navigation. 100k rows with no lag using virtualized infinite scroll. Search, filter, sort at the DB level. Saved views (filters + sorts + hidden fields). Target: 1M rows without issue.

**Status: All spec requirements implemented and working.**

---

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
npm run db-seed      # tsx prisma/seed.ts (seed with faker data — 100k rows per table)
```

---

## Stack

**T3 Stack**: Next.js 15 App Router + tRPC v11 + Prisma v7 + NextAuth v5 + Tailwind CSS v4

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Turbopack) |
| API | tRPC v11 with SuperJSON transformer |
| ORM | Prisma v7 with `@prisma/adapter-neon` (serverless) |
| Database | Neon Postgres (serverless) |
| Auth | NextAuth v5 beta + Google OAuth + Prisma adapter |
| Table UI | `@tanstack/react-table` v8 (columns, resizing) |
| Virtualization | `@tanstack/react-virtual` v3 (row virtualization) |
| Data fetching | `@tanstack/react-query` v5 via tRPC hooks |
| Styling | Tailwind CSS v4 |
| Validation | Zod v3 (end-to-end: router inputs + outputs + frontend) |
| Fake data | `@faker-js/faker` v10 (seeding + bulk insert) |
| Icons | `lucide-react` + custom Airtable SVG icons |

---

## Data Model

```
User → Base → Table → Field   (FieldType: TEXT | NUMBER)
                     → Record  (rows; cell values as JSONB: { fieldId: value })
                     → View    (saved filter/sort/hidden config as JSON arrays)
```

### Prisma Schema Notes

- `Record.data` is `Json @db.JsonB` with a **GIN index** (`@@index([data], type: Gin)`) for fast JSONB queries
- `Record.order` has `@@unique([tableId, order])` — this constraint is **DEFERRABLE** (see migration `20260316120000_make_record_order_deferrable`) to allow reordering without constraint violations
- `Field` has `@@unique([tableId, name])` — prevents duplicate column names per table
- Prisma client generated to `generated/prisma/` (not the default location) — import as `import { PrismaClient } from "../../generated/prisma"`
- Zod schemas auto-generated to `generated/zod/` via `prisma-zod-generator`

---

## tRPC API

Routers: `src/server/api/routers/` → `base`, `table`, `field`, `record`, `view`
Root: `src/server/api/root.ts`
Context + middleware: `src/server/api/trpc.ts`

### Procedure types

- `publicProcedure` — no auth required (all reads)
- `protectedProcedure` — requires `ctx.session.user` (all writes)

### Dev timing middleware

`trpc.ts` injects a random **100–500ms artificial delay** on every procedure in development to simulate network latency. This is intentional. Do not remove it when debugging slow behavior — account for it.

### Router summaries

#### `record` router (most complex)

| Procedure | Type | Description |
|-----------|------|-------------|
| `list` | query | Keyset cursor pagination, 5000 rows/page, includes COUNT on first page |
| `count` | query | Fast `COUNT(*)` for toolbar display |
| `listAll` | query | Server-side parallel batch fetch (50k/batch) for full dataset |
| `create` | mutation | Insert single row with auto-incremented order |
| `updateCell` | mutation | Merge value into JSONB data blob |
| `delete` | mutation | Remove single record |
| `bulkDelete` | mutation | Remove array of records |
| `bulkCreate` | mutation | Insert N rows with faker data (see bulk insert strategy below) |
| `reorder` | mutation | Move row using DEFERRABLE constraint + shift adjacent rows |

**`record.list` pagination**: Uses `WHERE order > cursor` on the `@@unique([tableId, order])` index — O(log n) keyset seek, not OFFSET (which degrades at scale). Returns `{ records, nextCursor, total }`. `total` only computed on the first page (cursor is null) to avoid redundant COUNT queries on subsequent pages.

**Filter SQL** (`buildFilterConditions()`):
- TEXT: `jsonb_extract_path_text(data, fieldId) ILIKE '%value%'` for contains/not_contains
- NUMBER: `CAST(jsonb_extract_path_text(data, fieldId) AS NUMERIC) > value` for gt/lt
- `is_empty` / `is_not_empty`: checks for NULL or empty string

**Sort SQL** (`buildOrderSQL()`): Multi-column with `NULLS LAST` — numeric fields cast to `NUMERIC` for correct ordering.

**Search SQL**: `jsonb_each_text(data)` with ILIKE across all field values.

**No Zod output validation** on `record.list` — skipped intentionally for throughput with large result sets.

#### `record.bulkCreate` — fast insert strategy

Four layered optimizations (applied in order):

1. **Parallel prefetch**: `table`, `fields`, and `last record order` all fetched in one `Promise.all` — saves one serial round-trip vs the previous sequential approach
2. **Value pools**: Pre-generates 500 faker values per field type upfront, then samples them per row — ~200× fewer faker function calls than calling `faker.person.fullName()` 100k times
3. **GIN index drop**: Drops `Record_data_idx` before the bulk insert to avoid 100k incremental GIN updates; recreates after — wrapped in try/catch so it's non-fatal if the index doesn't exist
4. **Parallel batch inserts**: Generates all rows in 10k-row batches, then fires all batches simultaneously via `Promise.all` — all DB round-trips overlap instead of being sequential
   - SQL: `INSERT INTO "Record" ... SELECT ... FROM json_array_elements($1::json) AS r`

#### `table` router

New tables are created with **3 default fields** (Name TEXT, Notes TEXT, Amount NUMBER) and **10 faker rows** using `fakeCellValue()` which generates contextual data based on field names.

`clearData` removes all records via `record.deleteMany` — use `utils.record.list.reset()` (not `invalidate`) on the client to immediately clear cached pages.

#### `view` router

`updateConfig` is a **patch** — only provided fields are updated. Filters, sorts, and hiddenFields are independently patchable. `parseViewConfig()` validates stored JSON with `.catch({})` fallback to handle corrupt data gracefully.

---

## Frontend Architecture

### Route structure

```
src/app/
  page.tsx              → redirects to /bases
  bases/page.tsx        → BasesView (dashboard)
  base/[baseId]/page.tsx → BaseView (main grid)
  shared/page.tsx       → SharedView (stub)
  starred/page.tsx      → StarredView (stub)
  workspaces/page.tsx   → WorkspacesView (stub)
```

### Component hierarchy for `/base/[baseId]`

```
BaseView (src/features/base/components/BaseView.tsx)
  ├── Icon rail (left, fixed)
  ├── Top nav bar (breadcrumb, share, history, etc.)
  ├── TableTabs (table selector tabs + create/rename/delete/clear)
  ├── Toolbar (search, hide fields, filter, sort, group, share)
  ├── ViewSidebar (left panel — saved views list)
  └── TableGrid (main grid with virtualized rows)
        ├── CellEditor (inline per-cell editor)
        ├── ColumnHeaderMenu (right-click column menu)
        └── AddColumnButton (+ button, type picker modal)
```

### URL-driven state (`BaseView`)

All view configuration lives in URL search params — the URL is always shareable/bookmarkable:

| Param | Type | Description |
|-------|------|-------------|
| `tableId` | string | Active table ID |
| `viewId` | string | Active view ID |
| `search` | string | Search query |
| `filters` | JSON string | `Filter[]` array |
| `sorts` | JSON string | `Sort[]` array |

**Exception**: `hiddenFieldIds` is React state (not URL) because it's local UI state that shouldn't pollute the URL.

`updateParams()` callback in `BaseView` batches URL param updates via `router.replace` to avoid multiple history entries.

### TableGrid internals

**Virtualization**: `@tanstack/react-virtual` virtualizes rows (32px row height). Only rows in the viewport + overscan window are rendered to the DOM. The scrollbar is sized using `total` from the first page's COUNT result.

**Infinite loading**: `useInfiniteQuery` with `PAGE_SIZE = 5000`. A `useEffect` eagerly fetches all pages in background (`hasNextPage && fetchNextPage()`). This means all 100k rows load progressively without user scroll action.

**Optimistic updates** on cell edit:
1. Cancel in-flight queries
2. Snapshot current cache
3. Apply update to `setInfiniteData`
4. On error: rollback via `setInfiniteData(snapshot)`

**Temporary records**: Rows created via `record.create` get a `temp-${Date.now()}` ID optimistically inserted. A `tempToRealId` Map tracks the mapping. A `pendingCellUpdates` ref queues any cell edits made on temp rows; once the mutation resolves, queued updates are flushed to the real ID.

**Row reordering**: Drag handle on left. Uses a DEFERRABLE `@@unique([tableId, order])` constraint so the shift of adjacent rows and the row's own order update can be batched in one transaction without transient uniqueness violations.

**Search highlighting**: Matches stored in a `Map<recordId, Set<fieldId>>`. `currentMatchIndex` tracks cursor position for prev/next navigation. Match count shown in toolbar.

**Column selection**: Clicking a column header selects the entire column (blue header highlight, highlighted cells). First cell in column is focused.

**Cell entry modes**:
- `"replace"`: All text pre-selected, cursor hidden, blue text. Typing replaces selection. Used when navigating via arrow keys.
- `"append"`: Cursor at end. Used when entering via Tab or clicking directly.

### ViewSidebar auto-save

ViewSidebar debounces config changes (filters/sorts/hidden fields) with a **600ms debounce** using `view.updateConfig`. When switching views:
1. Pending debounce is flushed immediately (the current view's config is saved)
2. New view config is fetched with `staleTime: 0` to bypass cache

### Cache invalidation strategy

After mutations, use:
- `utils.record.list.reset()` — wipes all cached pages immediately (rows disappear without waiting for refetch). Use after `bulkCreate` and `clearData`.
- `utils.record.count.invalidate()` — marks count stale, triggers background refetch.
- `utils.record.list.invalidate()` — marks stale but keeps stale data visible during refetch. Avoid for cases where immediate clearing is needed.

---

## Type System

All shared types in `src/types/` — imported by both routers and frontend. Central export: `src/types/index.ts`.

### Key types

```typescript
// Cell data blob
type RowData = Record<string, string | number | null>  // keyed by fieldId

// Filter discriminated union
type Filter =
  | { type: "TEXT";   fieldId: string; op: "contains"|"not_contains"|"equals"|"is_empty"|"is_not_empty"; value?: string }
  | { type: "NUMBER"; fieldId: string; op: "gt"|"lt"|"equals"; value: number }

// Sort
type Sort = { fieldId: string; fieldType: FieldType; direction: "asc"|"desc" }

// Field summary (used in frontend, not full Prisma model)
type FieldSummary = { id: string; name: string; type: FieldType }
```

---

## Auth

NextAuth v5 (beta) with Google OAuth. Config: `src/server/auth/config.ts`. Prisma adapter handles session/account/verification-token storage. `AUTH_SECRET` required in production, optional in dev.

---

## Environment Variables

Validated at startup via `@t3-oss/env-nextjs` in `src/env.js`:

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Always | Neon Postgres connection string |
| `GOOGLE_CLIENT_ID` | Always | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Always | Google OAuth |
| `AUTH_SECRET` | Prod only | NextAuth session secret |

---

## Performance Design

### Why this handles 1M+ rows

1. **Keyset pagination** (`WHERE order > cursor`) — O(log n) index seek, never degrades with table size unlike OFFSET
2. **Server-side COUNT** — computed only on the first page, not every paginated request
3. **Database-level search/filter/sort** — no client-side data processing; raw SQL with indexed JSONB ops
4. **GIN index on `data`** — enables efficient JSONB containment and path queries
5. **Row virtualization** — only ~30 DOM nodes rendered regardless of total row count
6. **Eager page prefetch** — all pages loaded in background so scrolling never waits

### Bulk insert optimization

The `record.bulkCreate` endpoint (used by the "Add 100k" button) applies all four optimizations listed above under the router section. Expected throughput: ~5-10× faster than naive sequential insertion.

---

## What's Implemented vs. Spec

| Spec Requirement | Status |
|-----------------|--------|
| T3 stack (Next.js + tRPC + Prisma + Postgres) | ✅ |
| Google login | ✅ |
| Create bases, tables | ✅ |
| Dynamic columns (TEXT + NUMBER) | ✅ |
| Cell editing + arrow/tab navigation | ✅ |
| New table default rows with faker data | ✅ |
| 100k rows without lag | ✅ (virtualized infinite scroll) |
| "Add 100k rows" button | ✅ (with faker data, optimized bulk insert) |
| Virtualized infinite scroll via tRPC + TanStack | ✅ |
| Search across cells (DB-level) | ✅ |
| Saved views | ✅ |
| Filters (text + number operators) | ✅ |
| Sorting (text A→Z, number asc/desc) | ✅ |
| Search/filter/sort at DB level | ✅ |
| Hide/show columns | ✅ |
| Loading states | ✅ |
| UI matches Airtable 1:1 | ✅ (pixel-matched nav, toolbar, grid, sidebar) |
| 1M row target | ✅ (architecture scales linearly) |

### UI stubs (rendered but non-functional)

These exist in the UI for visual fidelity but are not backed by functionality:
- Calendar, Gallery, Kanban, Timeline, List, Gantt, Form view types (only Grid is functional)
- "Team" badge on Timeline, Gantt, Section view types
- Group by, Color by, Row height controls in toolbar
- "Insert field left/right" in column context menu
- Various share/sync options in Share panel
- Field Agents (AI tools) in AddColumnButton

---

## Non-Obvious Implementation Details

- **Index column width** scales dynamically: 52px (≤999 rows) → 60px (≤9999) → 68px (≤99999) → 76px (1M+) to avoid clipping row numbers
- **`randomBytes(12).toString('hex')`** is used for record IDs in bulk inserts (generates `rec_` prefix + 24-char hex) instead of `gen_random_uuid()` in Postgres to move ID generation to JS and avoid per-row function call overhead
- **`$executeRawUnsafe`** is used for bulk inserts (not `$executeRaw` tagged templates) because the JSON payload is a runtime string parameter, not a static SQL template
- **Sidebar resize** is constrained to 280–720px via a `mousemove` handler that updates a `sidebarWidth` state
- **The artificial dev delay** (`100–500ms`) is per-tRPC-call, not per-DB-query. All 20 batch inserts within a single `bulkCreate` call share one delay.
- **`staleTime: 60_000`** on `record.list` means `invalidate()` alone won't immediately clear the cache — use `reset()` when you need rows to disappear immediately
- **GIN index name** is `Record_data_idx` (Prisma convention for `@@index([data], type: Gin)`)
- **DEFERRABLE constraint** `Record_tableId_order_key` is SET DEFERRED at the start of reorder transactions to allow intermediate states where two rows share the same order
- **CellEditor** hides the text caret initially in "replace" mode via `-webkit-text-fill-color: transparent` until the first keystroke replaces the selection
