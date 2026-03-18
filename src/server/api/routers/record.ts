import { randomBytes } from "crypto";

import { faker } from "@faker-js/faker";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { Prisma } from "generated/prisma/client";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  FilterSchema,
  RecordListInputSchema,
  RecordListAllInputSchema,
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
  id: string;
  tableId: string;
  order: number;
  data: unknown;
  createdAt: Date;
  updatedAt: Date;
};

function parseRecord(r: RawRecord) {
  return {
    id: r.id,
    tableId: r.tableId,
    order: r.order,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    data: RowDataSchema.catch({}).parse(r.data),
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
    // Prefix match (term%) across all field values: row matches if ANY value starts with search.
    // jsonb_each_text expands the JSONB per row; ILIKE 'term%' is then applied to each value.
    // NOTE: data::text ILIKE cannot be used here — that checks the whole JSON string (which
    // starts with '{'), not individual field values. The trgm index only helps contains-match.
    conditions.push(
      Prisma.sql`EXISTS (SELECT 1 FROM jsonb_each_text("Record"."data") AS kv WHERE kv.value ILIKE ${search + "%"})`,
    );
  }
  conditions.push(...buildFilterConditions(filters));
  return conditions.reduce((acc, cond, i) =>
    i === 0 ? cond : Prisma.sql`${acc} AND ${cond}`,
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
  // Keyset cursor pagination — WHERE "order" > cursor is O(log n) via the unique index.
  // COUNT is run in parallel on the first page only; skipped on subsequent pages.
  // No .output() Zod validation — skipped intentionally for throughput.
  list: publicProcedure
    .input(RecordListInputSchema)
    .query(async ({ ctx, input }) => {
      const isFirstPage = input.cursor === undefined;
      const whereSQL = buildWhereSQL(
        input.tableId,
        input.filters,
        input.search,
        input.cursor,
      );
      const orderSQL = buildOrderSQL(input.sorts);

      type SlimRow = {
        id: string;
        tableId: string;
        order: number;
        data: unknown;
        createdAt: Date;
        updatedAt: Date;
      };

      const countPromise = isFirstPage
        ? ctx.db.$queryRaw<[{ count: bigint }]>(Prisma.sql`
            SELECT COUNT(*)::bigint as count FROM "Record"
            WHERE ${buildWhereSQL(input.tableId, input.filters, input.search)}
          `)
        : Promise.resolve(null);

      const rowsPromise = ctx.db.$queryRaw<SlimRow[]>(Prisma.sql`
        SELECT "Record"."id", "Record"."tableId", "Record"."order",
               "Record"."data", "Record"."createdAt", "Record"."updatedAt"
        FROM   "Record"
        WHERE  ${whereSQL}
        ORDER BY ${Prisma.raw(orderSQL)}
        LIMIT  ${Prisma.raw(String(input.limit + 1))}
      `);

      const [countResult, rows] = await Promise.all([
        countPromise,
        rowsPromise,
      ]);
      const total = countResult ? Number(countResult[0]?.count ?? 0) : 0;

      const hasMore = rows.length > input.limit;
      const page = hasMore ? rows.slice(0, input.limit) : rows;
      const nextCursor = hasMore ? (page.at(-1)?.order ?? null) : null;

      return {
        records: page.map((r) => ({
          id: r.id,
          tableId: r.tableId,
          order: r.order,
          data: (r.data ?? {}) as Record<string, string | number | null>,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        })),
        nextCursor,
        total,
      };
    }),

  count: publicProcedure
    .input(
      z.object({
        tableId: z.string(),
        filters: z.array(FilterSchema).default([]),
        search: z.string().default(""),
      }),
    )
    .output(z.object({ total: z.number() }))
    .query(async ({ ctx, input }) => {
      const whereSQL = buildWhereSQL(
        input.tableId,
        input.filters,
        input.search,
      );
      const result = await ctx.db.$queryRaw<[{ count: bigint }]>(Prisma.sql`
        SELECT COUNT(*)::bigint as count FROM "Record" WHERE ${whereSQL}
      `);
      return { total: Number(result[0]?.count ?? 0) };
    }),

  // Fetches the entire dataset: counts rows, then fires all pages in parallel.
  listAll: publicProcedure
    .input(RecordListAllInputSchema)
    .query(async ({ ctx, input }) => {
      const whereSQL = buildWhereSQL(
        input.tableId,
        input.filters,
        input.search,
      );
      const orderSQL = buildOrderSQL(input.sorts);

      const PAGE_SIZE = 50000;

      type SlimRow = { id: string; order: number; data: unknown };

      const countResult = await ctx.db.$queryRaw<
        [{ count: bigint }]
      >(Prisma.sql`
        SELECT COUNT(*)::bigint as count FROM "Record" WHERE ${whereSQL}
      `);
      const total = Number(countResult[0]?.count ?? 0);
      if (total === 0) return { records: [], total: 0 };

      const pageCount = Math.ceil(total / PAGE_SIZE);
      const pages = await Promise.all(
        Array.from({ length: pageCount }, (_, i) =>
          ctx.db.$queryRaw<SlimRow[]>(Prisma.sql`
            SELECT "Record"."id", "Record"."order", "Record"."data"
            FROM   "Record"
            WHERE  ${whereSQL}
            ORDER BY ${Prisma.raw(orderSQL)}
            LIMIT  ${Prisma.raw(String(PAGE_SIZE))}
            OFFSET ${Prisma.raw(String(i * PAGE_SIZE))}
          `),
        ),
      );

      const now = new Date();
      const tid = input.tableId;
      const records = new Array(total);
      let idx = 0;
      for (const page of pages) {
        for (const r of page) {
          records[idx++] = {
            id: r.id,
            tableId: tid,
            order: r.order,
            data: (r.data ?? {}) as Record<string, string | number | null>,
            createdAt: now,
            updatedAt: now,
          };
        }
      }
      records.length = idx; // trim if total was slightly off

      return { records, total };
    }),

  create: publicProcedure
    .input(RecordCreateInputSchema)
    .output(RowSchema)
    .mutation(async ({ ctx, input }) => {
      const table = await ctx.db.table.findUnique({
        where: { id: input.tableId },
      });
      if (!table)
        throw new TRPCError({ code: "NOT_FOUND", message: "Table not found" });
      const last = await ctx.db.record.findFirst({
        where: { tableId: input.tableId },
        orderBy: { order: "desc" },
        select: { order: true },
      });
      const record = await ctx.db.record.create({
        data: {
          tableId: input.tableId,
          order: (last?.order ?? -1) + 1,
          data: input.data,
        },
      });
      return parseRecord(record);
    }),

  updateCell: publicProcedure
    .input(CellUpdateInputSchema)
    .output(RowSchema)
    .mutation(async ({ ctx, input }) => {
      const record = await ctx.db.record.findUnique({
        where: { id: input.recordId },
      });
      if (!record)
        throw new TRPCError({ code: "NOT_FOUND", message: "Record not found" });
      const currentData = RowDataSchema.catch({}).parse(record.data);
      const updated = await ctx.db.record.update({
        where: { id: input.recordId },
        data: { data: { ...currentData, [input.fieldId]: input.value } },
      });
      return parseRecord(updated);
    }),

  delete: protectedProcedure
    .input(RecordDeleteInputSchema)
    .output(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.record.delete({ where: { id: input.id } });
      return { id: input.id };
    }),

  bulkDelete: protectedProcedure
    .input(RecordBulkDeleteInputSchema)
    .output(z.object({ deleted: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.record.deleteMany({
        where: { id: { in: input.ids } },
      });
      return { deleted: result.count };
    }),

  // Inserts up to 100k rows with four optimizations: (1) drops the GIN index on `data`
  // before insert to avoid per-row index updates, (2) pre-generates 500-item faker value
  // pools to avoid repeated faker calls, (3) batches inserts in 10k-row chunks, and
  // (4) fires all batch inserts in parallel via Promise.all.
  bulkCreate: protectedProcedure
    .input(RecordBulkCreateInputSchema)
    .output(z.object({ created: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const [table, fields, last] = await Promise.all([
        ctx.db.table.findUnique({ where: { id: input.tableId } }),
        ctx.db.field.findMany({
          where: { tableId: input.tableId },
          orderBy: { order: "asc" },
        }),
        ctx.db.record.findFirst({
          where: { tableId: input.tableId },
          orderBy: { order: "desc" },
          select: { order: true },
        }),
      ]);
      if (!table)
        throw new TRPCError({ code: "NOT_FOUND", message: "Table not found" });

      const startOrder = (last?.order ?? -1) + 1;

      const POOL = 500;
      const pick = <T>(arr: T[]) =>
        arr[Math.floor(Math.random() * arr.length)]!;

      const DEAL_STAGES = [
        "Prospecting",
        "Qualified",
        "Proposal",
        "Negotiation",
        "Closed Won",
        "Closed Lost",
      ];
      const TASK_STATUSES = [
        "Todo",
        "In Progress",
        "In Review",
        "Done",
        "Blocked",
      ];
      const HIRE_STAGES = [
        "Applied",
        "Phone Screen",
        "Technical",
        "Onsite",
        "Offer",
        "Hired",
        "Rejected",
      ];

      const pools: Record<string, (string | number)[]> = {};
      const isDealTable = fields.some((x) => x.name === "Deal Name");

      for (const f of fields) {
        const n = f.name;
        if (n === "Name")
          pools[f.id] = Array.from({ length: POOL }, () =>
            faker.person.fullName(),
          );
        else if (n === "Email")
          pools[f.id] = Array.from({ length: POOL }, () =>
            faker.internet.email(),
          );
        else if (n === "Company")
          pools[f.id] = Array.from({ length: POOL }, () =>
            faker.company.name(),
          );
        else if (n === "Deal Name")
          pools[f.id] = Array.from({ length: POOL }, () =>
            faker.company.buzzPhrase(),
          );
        else if (n === "Stage")
          pools[f.id] = isDealTable ? DEAL_STAGES : HIRE_STAGES;
        else if (n === "Title")
          pools[f.id] = Array.from({ length: POOL }, () =>
            faker.hacker.phrase(),
          );
        else if (n === "Status") pools[f.id] = TASK_STATUSES;
        else if (n === "Role")
          pools[f.id] = Array.from({ length: POOL }, () =>
            faker.person.jobTitle(),
          );
        else if (n === "Salary")
          pools[f.id] = Array.from({ length: POOL }, () =>
            faker.number.int({ min: 60_000, max: 300_000 }),
          );
        else if (n === "Value")
          pools[f.id] = Array.from({ length: POOL }, () =>
            faker.number.int({ min: 1_000, max: 500_000 }),
          );
        else if (n === "Lead Score" || n === "Priority")
          pools[f.id] = Array.from({ length: POOL }, () =>
            faker.number.int({ min: 1, max: 100 }),
          );
        else if (f.type === "NUMBER")
          pools[f.id] = Array.from({ length: POOL }, () =>
            faker.number.int({ min: 0, max: 9_999 }),
          );
        else
          pools[f.id] = Array.from({ length: POOL }, () =>
            faker.lorem.words(3),
          );
      }

      function makeData(): Record<string, string | number> {
        const row: Record<string, string | number> = {};
        for (const f of fields) row[f.id] = pick(pools[f.id]!);
        return row;
      }

      // Drop GIN indexes before bulk insert to avoid per-row index updates (major speedup).
      // Both the JSONB containment index and the trigram search index are dropped and rebuilt.
      const GIN_INDEX = "Record_data_idx";
      const TRGM_INDEX = "Record_data_trgm_idx";
      let ginDropped = false;
      try {
        await Promise.all([
          ctx.db.$executeRawUnsafe(`DROP INDEX IF EXISTS "${GIN_INDEX}"`),
          ctx.db.$executeRawUnsafe(`DROP INDEX IF EXISTS "${TRGM_INDEX}"`),
        ]);
        ginDropped = true;
      } catch {
        /* non-fatal — proceed without the optimisation */
      }

      const BATCH = 10_000;
      const now = new Date().toISOString();

      const batches: string[] = [];
      for (let offset = 0; offset < input.count; offset += BATCH) {
        const count = Math.min(BATCH, input.count - offset);
        const rows = Array.from({ length: count }, (_, i) => ({
          id: "rec_" + randomBytes(12).toString("hex"),
          tableId: input.tableId,
          order: startOrder + offset + i,
          data: makeData(),
          createdAt: now,
          updatedAt: now,
        }));
        batches.push(JSON.stringify(rows));
      }

      const INSERT_SQL = `
        INSERT INTO "Record" ("id", "tableId", "order", "data", "createdAt", "updatedAt")
        SELECT
          r->>'id',
          r->>'tableId',
          (r->>'order')::int,
          (r->'data')::jsonb,
          (r->>'createdAt')::timestamptz,
          (r->>'updatedAt')::timestamptz
        FROM json_array_elements($1::json) AS r
      `;

      await Promise.all(
        batches.map((json) => ctx.db.$executeRawUnsafe(INSERT_SQL, json)),
      );

      if (ginDropped) {
        await Promise.all([
          ctx.db.$executeRawUnsafe(
            `CREATE INDEX "${GIN_INDEX}" ON "Record" USING GIN ("data")`,
          ),
          ctx.db.$executeRawUnsafe(
            `CREATE INDEX "${TRGM_INDEX}" ON "Record" USING GIN ((data::text) gin_trgm_ops)`,
          ),
        ]);
      }

      return { created: input.count };
    }),

  reorder: protectedProcedure
    .input(
      z.object({
        recordId: z.string(),
        tableId: z.string(),
        fromOrder: z.number(),
        toOrder: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { recordId, tableId, fromOrder, toOrder } = input;
      if (fromOrder === toOrder) return { success: true };

      // Defer the unique constraint to allow intermediate order conflicts within the transaction.
      await ctx.db.$transaction(async (tx) => {
        await tx.$executeRawUnsafe(
          `SET CONSTRAINTS "Record_tableId_order_key" DEFERRED`,
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
