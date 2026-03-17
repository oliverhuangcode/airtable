import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { Prisma } from "generated/prisma/client";
import {
  FilterSchema,
  SortSchema,
  RecordListInputSchema,
  RecordListOutputSchema,
  RecordListAllInputSchema,
  RecordListAllOutputSchema,
  RecordCreateInputSchema,
  RecordDeleteInputSchema,
  RecordBulkDeleteInputSchema,
  RecordBulkCreateInputSchema,
  CellUpdateInputSchema,
  RowSchema,
  RowDataSchema,
  type Filter,
  type Sort,
} from "~/types";

type RawRecord = {
  id:        string;
  tableId:   string;
  order:     number;
  data:      unknown;
  createdAt: Date;
  updatedAt: Date;
};

function parseRecord(r: RawRecord) {
  return {
    id:        r.id,
    tableId:   r.tableId,
    order:     r.order,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    data:      RowDataSchema.catch({}).parse(r.data),
  };
}

function buildFilterConditions(filters: Filter[]): Prisma.Sql[] {
  return filters.map((f) => {
    const key = f.fieldId;
    if (f.type === "text") {
      switch (f.op) {
        case "contains":
          return Prisma.sql`"Record"."data"->>${key} ILIKE ${"%" + (f.value ?? "") + "%"}`;
        case "not_contains":
          return Prisma.sql`"Record"."data"->>${key} NOT ILIKE ${"%" + (f.value ?? "") + "%"}`;
        case "equals":
          return Prisma.sql`"Record"."data" @> ${JSON.stringify({ [key]: f.value ?? "" })}::jsonb`;
        case "is_empty":
          return Prisma.sql`(NOT ("Record"."data" ? ${key}) OR "Record"."data"->>${key} = '')`;
        case "is_not_empty":
          return Prisma.sql`("Record"."data" ? ${key} AND "Record"."data"->>${key} != '')`;
      }
    } else {
      switch (f.op) {
        case "gt":
          return Prisma.sql`("Record"."data"->>${key})::numeric > ${f.value}`;
        case "lt":
          return Prisma.sql`("Record"."data"->>${key})::numeric < ${f.value}`;
        case "equals":
          return Prisma.sql`"Record"."data" @> ${JSON.stringify({ [key]: f.value })}::jsonb`;
      }
    }
  });
}

function buildWhereSQL(
  tableId: string,
  filters: Filter[],
  search: string,
  cursor?: number,
): Prisma.Sql {
  const conditions: Prisma.Sql[] = [
    Prisma.sql`"Record"."tableId" = ${tableId}`,
  ];
  if (cursor !== undefined) {
    conditions.push(Prisma.sql`"Record"."order" > ${cursor}`);
  }
  if (search) {
    conditions.push(Prisma.sql`"Record"."data"::text ILIKE ${"%" + search + "%"}`);
  }
  conditions.push(...buildFilterConditions(filters));
  return conditions.reduce(
    (acc, cond, i) => i === 0 ? cond : Prisma.sql`${acc} AND ${cond}`,
  );
}

function buildOrderSQL(sorts: Sort[]): string {
  if (sorts.length === 0) return `"Record"."order" ASC`;
  const clauses = sorts.map((sort) => {
    const dir = sort.direction === "asc" ? "ASC" : "DESC";
    return sort.fieldType === "NUMBER"
      ? `("Record"."data"->>'${sort.fieldId}')::numeric ${dir} NULLS LAST`
      : `"Record"."data"->>'${sort.fieldId}' ${dir} NULLS LAST`;
  });
  clauses.push(`"Record"."order" ASC`);
  return clauses.join(", ");
}

export const recordRouter = createTRPCRouter({

  // ── list: cursor-based keyset pagination ──────────────────────────────────
  // Used with useInfiniteQuery on the frontend.
  // cursor = `order` of last row on previous page.
  // WHERE "order" > cursor seeks via @@unique([tableId, order]) — O(log n).
  // Returns nextCursor = null when no more rows exist.
  list: publicProcedure
    .input(RecordListInputSchema)
    .output(RecordListOutputSchema)
    .query(async ({ ctx, input }) => {
      // Skip table existence check — WHERE tableId=X returns 0 rows if table doesn't exist.
      // Saves one round-trip per page fetch.
      const whereSQL = buildWhereSQL(input.tableId, input.filters, input.search, input.cursor);
      const orderSQL = buildOrderSQL(input.sorts);

      const rows = await ctx.db.$queryRaw<RawRecord[]>(Prisma.sql`
        SELECT "Record"."id", "Record"."tableId", "Record"."order",
               "Record"."data", "Record"."createdAt", "Record"."updatedAt"
        FROM   "Record"
        WHERE  ${whereSQL}
        ORDER BY ${Prisma.raw(orderSQL)}
        LIMIT  ${Prisma.raw(String(input.limit + 1))}
      `);

      const hasMore    = rows.length > input.limit;
      const page       = hasMore ? rows.slice(0, input.limit) : rows;
      const nextCursor = hasMore ? (page.at(-1)?.order ?? null) : null;

      return { records: page.map(parseRecord), nextCursor, total: 0 };
    }),

  // ── count: total rows for footer display ──────────────────────────────────
  // For unfiltered queries, uses a fast count via reltuples estimate or simple COUNT.
  count: publicProcedure
    .input(z.object({
      tableId: z.string(),
      filters: z.array(FilterSchema).default([]),
      search:  z.string().default(""),
    }))
    .output(z.object({ total: z.number() }))
    .query(async ({ ctx, input }) => {
      // Fast path: no filters/search → use simple COUNT with tableId index
      const whereSQL = buildWhereSQL(input.tableId, input.filters, input.search);
      const result   = await ctx.db.$queryRaw<[{ count: bigint }]>(Prisma.sql`
        SELECT COUNT(*)::bigint as count FROM "Record" WHERE ${whereSQL}
      `);
      return { total: Number(result[0]?.count ?? 0) };
    }),

  // ── listAll: server-side parallel batch fetch ────────────────────────────
  // Single tRPC call: count + all OFFSET/LIMIT pages fire in parallel.
  // Skips Zod parsing and unused columns for maximum throughput.
  listAll: publicProcedure
    .input(RecordListAllInputSchema)
    .query(async ({ ctx, input }) => {
      const whereSQL = buildWhereSQL(input.tableId, input.filters, input.search);
      const orderSQL = buildOrderSQL(input.sorts);

      const PAGE_SIZE = 25000;

      type SlimRow = { id: string; order: number; data: unknown };

      // Fast estimate via reltuples to determine speculative page count
      const estResult = await ctx.db.$queryRaw<[{ est: number }]>(Prisma.sql`
        SELECT GREATEST(reltuples, 0)::int as est
        FROM pg_class WHERE relname = 'Record'
      `);
      const estimate = estResult[0]?.est ?? 0;
      const specPages = Math.max(1, Math.ceil(estimate / PAGE_SIZE));

      // Fire count + ALL speculative pages in a single Promise.all
      const allPromises = [
        ctx.db.$queryRaw<[{ count: bigint }]>(Prisma.sql`
          SELECT COUNT(*)::bigint as count FROM "Record" WHERE ${whereSQL}
        `),
        ...Array.from({ length: specPages }, (_, i) =>
          ctx.db.$queryRaw<SlimRow[]>(Prisma.sql`
            SELECT "Record"."id", "Record"."order", "Record"."data"
            FROM   "Record"
            WHERE  ${whereSQL}
            ORDER BY ${Prisma.raw(orderSQL)}
            LIMIT  ${Prisma.raw(String(PAGE_SIZE))}
            OFFSET ${Prisma.raw(String(i * PAGE_SIZE))}
          `)
        ),
      ];

      const results = await Promise.all(allPromises);
      const total = Number((results[0] as [{ count: bigint }])[0]?.count ?? 0);
      if (total === 0) return { records: [], total: 0 };

      // Collect only pages we actually need
      const actualPages = Math.ceil(total / PAGE_SIZE);
      let allRaw: SlimRow[] = [];
      for (let i = 0; i < actualPages && i + 1 < results.length; i++) {
        allRaw = allRaw.concat(results[i + 1] as SlimRow[]);
      }

      // If estimate was too low, fetch remaining pages
      if (actualPages > specPages) {
        const extra = await Promise.all(
          Array.from({ length: actualPages - specPages }, (_, i) =>
            ctx.db.$queryRaw<SlimRow[]>(Prisma.sql`
              SELECT "Record"."id", "Record"."order", "Record"."data"
              FROM   "Record"
              WHERE  ${whereSQL}
              ORDER BY ${Prisma.raw(orderSQL)}
              LIMIT  ${Prisma.raw(String(PAGE_SIZE))}
              OFFSET ${Prisma.raw(String((specPages + i) * PAGE_SIZE))}
            `)
          )
        );
        for (const page of extra) allRaw = allRaw.concat(page);
      }

      // Skip Zod parsing — raw data is trusted from our own DB.
      // Use shared Date to avoid 100k allocations (frontend doesn't display these).
      const now = new Date();
      const tid = input.tableId;
      const records = allRaw.map((r) => ({
        id:        r.id,
        tableId:   tid,
        order:     r.order,
        data:      (r.data ?? {}) as Record<string, string | number | null>,
        createdAt: now,
        updatedAt: now,
      }));

      return { records, total };
    }),

  // ── create ────────────────────────────────────────────────────────────────
  create: publicProcedure
    .input(RecordCreateInputSchema)
    .output(RowSchema)
    .mutation(async ({ ctx, input }) => {
      const table = await ctx.db.table.findUnique({ where: { id: input.tableId } });
      if (!table) throw new TRPCError({ code: "NOT_FOUND", message: "Table not found" });
      const last = await ctx.db.record.findFirst({
        where: { tableId: input.tableId }, orderBy: { order: "desc" }, select: { order: true },
      });
      const record = await ctx.db.record.create({
        data: { tableId: input.tableId, order: (last?.order ?? -1) + 1, data: input.data },
      });
      return parseRecord(record);
    }),

  // ── updateCell ────────────────────────────────────────────────────────────
  updateCell: publicProcedure
    .input(CellUpdateInputSchema)
    .output(RowSchema)
    .mutation(async ({ ctx, input }) => {
      const record = await ctx.db.record.findUnique({ where: { id: input.recordId } });
      if (!record) throw new TRPCError({ code: "NOT_FOUND", message: "Record not found" });
      const currentData = RowDataSchema.catch({}).parse(record.data);
      const updated = await ctx.db.record.update({
        where: { id: input.recordId },
        data:  { data: { ...currentData, [input.fieldId]: input.value } },
      });
      return parseRecord(updated);
    }),

  // ── delete ────────────────────────────────────────────────────────────────
  delete: protectedProcedure
    .input(RecordDeleteInputSchema)
    .output(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.record.delete({ where: { id: input.id } });
      return { id: input.id };
    }),

  // ── bulkDelete ────────────────────────────────────────────────────────────
  bulkDelete: protectedProcedure
    .input(RecordBulkDeleteInputSchema)
    .output(z.object({ deleted: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.record.deleteMany({ where: { id: { in: input.ids } } });
      return { deleted: result.count };
    }),

  // ── bulkCreate ────────────────────────────────────────────────────────────
  // Pure-SQL data generation via generate_series — no JS faker overhead.
  // Drops GIN index before insert, recreates after for maximum throughput.
  bulkCreate: protectedProcedure
    .input(RecordBulkCreateInputSchema)
    .output(z.object({ created: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const table = await ctx.db.table.findUnique({
        where: { id: input.tableId }, include: { fields: true },
      });
      if (!table) throw new TRPCError({ code: "NOT_FOUND", message: "Table not found" });

      const last = await ctx.db.record.findFirst({
        where: { tableId: input.tableId }, orderBy: { order: "desc" }, select: { order: true },
      });
      const startOrder = (last?.order ?? -1) + 1;

      // Build a SQL expression that generates a random JSONB blob for each row
      // based on actual field definitions (names/types).
      const jsonParts = table.fields.map((f) => {
        const key = f.id;
        if (f.type === "NUMBER") {
          return `'${key}', round((random() * 9999 + 1)::numeric, 2)`;
        }
        // Text fields — use field name to pick contextual sample arrays
        const name = f.name.toLowerCase();
        let arrayExpr: string;
        if (name.includes("name")) {
          arrayExpr = `(ARRAY['Alice Johnson','Bob Smith','Carol Williams','David Brown','Eva Martinez','Frank Wilson','Grace Lee','Henry Taylor','Iris Anderson','Jack Thomas','Karen White','Leo Harris','Maya Clark','Noah Lewis','Olivia Robinson','Peter Walker','Quinn Hall','Rachel Young','Sam King','Tina Wright','Uma Scott','Victor Adams','Wendy Baker','Xavier Nelson','Yuki Hill','Zara Green'])[floor(random()*26+1)::int]`;
        } else if (name.includes("email")) {
          arrayExpr = `concat((ARRAY['alice','bob','carol','david','eva','frank','grace','henry','iris','jack','karen','leo','maya','noah','olivia','peter','quinn','rachel','sam','tina'])[floor(random()*20+1)::int], floor(random()*9999+1)::int::text, (ARRAY['@gmail.com','@yahoo.com','@outlook.com','@company.com','@example.com'])[floor(random()*5+1)::int])`;
        } else if (name.includes("company")) {
          arrayExpr = `(ARRAY['Acme Corp','Globex','Initech','Hooli','Pied Piper','Soylent','Umbrella','Wayne Enterprises','Stark Industries','Cyberdyne','Aperture Science','Wonka Industries','Dunder Mifflin','Sterling Cooper','Prestige Worldwide','Vandelay Industries','Bluth Company','InGen','Tyrell Corp','Massive Dynamic'])[floor(random()*20+1)::int]`;
        } else if (name.includes("phone")) {
          arrayExpr = `concat('(', floor(random()*900+100)::int::text, ') ', floor(random()*900+100)::int::text, '-', floor(random()*9000+1000)::int::text)`;
        } else if (name.includes("status")) {
          arrayExpr = `(ARRAY['Active','Inactive','Pending'])[floor(random()*3+1)::int]`;
        } else if (name.includes("note")) {
          arrayExpr = `(ARRAY['Follow up next week','Urgent request pending','Meeting scheduled','Awaiting approval','Review completed','Needs attention','On track','Delayed delivery','Budget approved','Contract signed','In progress','Waiting for feedback','Escalated to manager','Priority task','Draft submitted','Final review','Shipped today','Customer satisfied','Issue resolved','Pending verification'])[floor(random()*20+1)::int]`;
        } else {
          arrayExpr = `(ARRAY['alpha','bravo','charlie','delta','echo','foxtrot','golf','hotel','india','juliet','kilo','lima','mike','november','oscar','papa','quebec','romeo','sierra','tango'])[floor(random()*20+1)::int]`;
        }
        return `'${key}', ${arrayExpr}`;
      });

      const jsonBuildExpr = `jsonb_build_object(${jsonParts.join(", ")})`;

      // Drop GIN index before bulk insert for massive speedup
      await ctx.db.$executeRawUnsafe(
        `DROP INDEX IF EXISTS "Record_data_idx"`
      );

      // Use interactive transaction: defer unique constraint + single INSERT...SELECT
      const count = input.count;
      await ctx.db.$transaction(async (tx) => {
        await tx.$executeRawUnsafe(
          `SET CONSTRAINTS "Record_tableId_order_key" DEFERRED`
        );
        await tx.$executeRawUnsafe(`
          INSERT INTO "Record" ("id", "tableId", "order", "data", "createdAt", "updatedAt")
          SELECT
            gen_random_uuid(),
            '${table.id}',
            ${startOrder} + gs.i,
            ${jsonBuildExpr},
            NOW(),
            NOW()
          FROM generate_series(0, ${count - 1}) AS gs(i)
        `);
      }, { timeout: 120000 });

      // Recreate GIN index (non-concurrently since we need it done before returning)
      await ctx.db.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "Record_data_idx" ON "Record" USING gin ("data")`
      );

      return { created: input.count };
    }),

  // ── reorder: move a record to a new position ─────────────────────────────
  reorder: protectedProcedure
    .input(z.object({
      recordId:   z.string(),
      tableId:    z.string(),
      fromOrder:  z.number(),
      toOrder:    z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { recordId, tableId, fromOrder, toOrder } = input;
      if (fromOrder === toOrder) return { success: true };

      // Constraint is DEFERRABLE — defer checking to transaction commit
      await ctx.db.$transaction(async (tx) => {
        await tx.$executeRawUnsafe(
          `SET CONSTRAINTS "Record_tableId_order_key" DEFERRED`
        );

        if (fromOrder < toOrder) {
          await tx.$executeRaw(Prisma.sql`
            UPDATE "Record"
            SET "order" = "order" - 1
            WHERE "tableId" = ${tableId}
              AND "order" > ${fromOrder}
              AND "order" <= ${toOrder}
          `);
        } else {
          await tx.$executeRaw(Prisma.sql`
            UPDATE "Record"
            SET "order" = "order" + 1
            WHERE "tableId" = ${tableId}
              AND "order" >= ${toOrder}
              AND "order" < ${fromOrder}
          `);
        }

        await tx.$executeRaw(Prisma.sql`
          UPDATE "Record" SET "order" = ${toOrder}
          WHERE "id" = ${recordId}
        `);
      });

      return { success: true };
    }),
});