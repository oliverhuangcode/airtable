import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { Prisma } from "generated/prisma/client";
import { faker } from "@faker-js/faker";
import {
  FilterSchema,
  SortSchema,
  RecordListInputSchema,
  RecordListOutputSchema,
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

function fakeCellValue(fieldName: string, fieldType: "TEXT" | "NUMBER"): string | number {
  if (fieldType === "NUMBER") return faker.number.float({ min: 1, max: 10000, fractionDigits: 2 });
  const name = fieldName.toLowerCase();
  if (name.includes("name"))    return faker.person.fullName();
  if (name.includes("email"))   return faker.internet.email();
  if (name.includes("company")) return faker.company.name();
  if (name.includes("phone"))   return faker.phone.number();
  if (name.includes("status"))  return faker.helpers.arrayElement(["Active", "Inactive", "Pending"]);
  if (name.includes("note"))    return faker.lorem.sentence();
  return faker.lorem.words(2);
}

function generateRows(
  tableId: string,
  fields: { id: string; name: string; type: string }[],
  startOrder: number,
  count: number,
) {
  return Array.from({ length: count }, (_, i) => ({
    tableId,
    order: startOrder + i,
    data:  Object.fromEntries(
      fields.map((f) => [f.id, fakeCellValue(f.name, f.type as "TEXT" | "NUMBER")]),
    ),
  }));
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
      const table = await ctx.db.table.findUnique({ where: { id: input.tableId } });
      if (!table) throw new TRPCError({ code: "NOT_FOUND", message: "Table not found" });

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
  count: publicProcedure
    .input(z.object({
      tableId: z.string(),
      filters: z.array(FilterSchema).default([]),
      search:  z.string().default(""),
    }))
    .output(z.object({ total: z.number() }))
    .query(async ({ ctx, input }) => {
      const whereSQL = buildWhereSQL(input.tableId, input.filters, input.search);
      const result   = await ctx.db.$queryRaw<[{ count: bigint }]>(Prisma.sql`
        SELECT COUNT(*)::bigint as count FROM "Record" WHERE ${whereSQL}
      `);
      return { total: Number(result[0]?.count ?? 0) };
    }),

  // ── create ────────────────────────────────────────────────────────────────
  create: protectedProcedure
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
  updateCell: protectedProcedure
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
      const CHUNK      = 10000;
      const chunkCount = Math.ceil(input.count / CHUNK);
      const allRows    = generateRows(input.tableId, table.fields, startOrder, input.count);
      const now        = new Date();

      await Promise.all(
        Array.from({ length: chunkCount }, (_, chunkIndex) => {
          const chunkRows = allRows.slice(chunkIndex * CHUNK, (chunkIndex + 1) * CHUNK);
          const values    = Prisma.join(
            chunkRows.map((row) =>
              Prisma.sql`(gen_random_uuid(), ${row.tableId}, ${row.order}, ${JSON.stringify(row.data)}::jsonb, ${now}, ${now})`
            ),
          );
          return ctx.db.$executeRaw(Prisma.sql`
            INSERT INTO "Record" ("id", "tableId", "order", "data", "createdAt", "updatedAt")
            VALUES ${values}
          `);
        })
      );

      return { created: input.count };
    }),
});