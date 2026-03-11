import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { Prisma } from "generated/prisma/client";
import { faker } from "@faker-js/faker";
import {
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

// ─── Types ────────────────────────────────────────────────────────────────────

type RawRecordRow = { id: string; order: number };

// ─── Helper: parse raw DB record to typed Row ─────────────────────────────────

function parseRecord(r: {
  id: string;
  tableId: string;
  order: number;
  data: unknown;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id:        r.id,
    tableId:   r.tableId,
    order:     r.order,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    data:      RowDataSchema.catch({}).parse(r.data),
  };
}

// ─── Helper: build Prisma WHERE from filters ──────────────────────────────────

function buildFilterWhere(filters: Filter[]): Prisma.RecordWhereInput[] {
  return filters.map((f) => {
    const key = f.fieldId;

    if (f.type === "text") {
      switch (f.op) {
        case "contains":
          return { data: { path: [key], string_contains: f.value ?? "" } };
        case "not_contains":
          return { NOT: { data: { path: [key], string_contains: f.value ?? "" } } };
        case "equals":
          return { data: { path: [key], equals: f.value ?? "" } };
        case "is_empty":
          return {
            OR: [
              { data: { path: [key], equals: Prisma.JsonNull } },
              { data: { path: [key], equals: "" } },
            ],
          };
        case "is_not_empty":
          return {
            AND: [
              { NOT: { data: { path: [key], equals: Prisma.JsonNull } } },
              { NOT: { data: { path: [key], equals: "" } } },
            ],
          };
      }
    } else {
      switch (f.op) {
        case "gt":     return { data: { path: [key], gt:     f.value } };
        case "lt":     return { data: { path: [key], lt:     f.value } };
        case "equals": return { data: { path: [key], equals: f.value } };
      }
    }
  });
}

// ─── Helper: build ORDER BY SQL for JSONB sorting ─────────────────────────────
//
// fieldId must use Prisma.raw() — PostgreSQL does not allow $N parameters
// in ORDER BY expressions, only in WHERE value comparisons.
//
// fieldId comes from our own DB (not user input) so Prisma.raw is safe here.

function buildSortSQL(sorts: Sort[]): Prisma.Sql {
  if (sorts.length === 0) {
    return Prisma.sql`ORDER BY "Record"."order" ASC`;
  }

  const clauses = sorts.map((sort) => {
    const dir     = sort.direction === "asc" ? "ASC" : "DESC";
    const fieldId = sort.fieldId; // comes from our DB, safe to use in Prisma.raw

    if (sort.fieldType === "NUMBER") {
      // Prisma.raw for both the field id expression and direction —
      // neither can be a parameterised value in ORDER BY
      return Prisma.raw(
        `("Record"."data"->>'${fieldId}')::numeric ${dir} NULLS LAST`,
      );
    } else {
      return Prisma.raw(
        `"Record"."data"->>'${fieldId}' ${dir} NULLS LAST`,
      );
    }
  });

  // join clauses with commas
  const joined = clauses.reduce<Prisma.Sql>(
    (acc, clause, i) =>
      i === 0
        ? Prisma.sql`${clause}`
        : Prisma.sql`${acc}, ${clause}`,
    Prisma.empty,
  );

  return Prisma.sql`ORDER BY ${joined}, "Record"."order" ASC`;
}

// ─── Helper: generate a fake row data object for bulk insert ──────────────────

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

// ─── Router ───────────────────────────────────────────────────────────────────

export const recordRouter = createTRPCRouter({

  // ─── READ ───────────────────────────────────────────────────────────────────

  list: publicProcedure
    .input(RecordListInputSchema)
    .output(RecordListOutputSchema)
    .query(async ({ ctx, input }) => {
      const table = await ctx.db.table.findUnique({ where: { id: input.tableId } });
      if (!table) throw new TRPCError({ code: "NOT_FOUND", message: "Table not found" });

      const filterWhere = buildFilterWhere(input.filters);

      const searchWhere: Prisma.RecordWhereInput[] = input.search
        ? [{ data: { string_contains: input.search } }]
        : [];

      // ── Path A: no sorts → pure Prisma ─────────────────────────────────────
      if (input.sorts.length === 0) {
        const where: Prisma.RecordWhereInput = {
          tableId: input.tableId,
          ...(input.cursor !== undefined ? { order: { gt: input.cursor } } : {}),
          AND: [...filterWhere, ...searchWhere],
        };

        const [records, total] = await Promise.all([
          ctx.db.record.findMany({
            where,
            orderBy: [{ order: "asc" }],
            take:    input.limit + 1,
          }),
          ctx.db.record.count({
            where: { tableId: input.tableId, AND: [...filterWhere, ...searchWhere] },
          }),
        ]);

        const hasMore    = records.length > input.limit;
        const page       = hasMore ? records.slice(0, input.limit) : records;
        const nextCursor = hasMore ? (page[page.length - 1]?.order ?? null) : null;

        return {
          records:    page.map(parseRecord),
          nextCursor,
          total,
        };
      }

      // ── Path B: sorts → raw SQL with Prisma.raw ORDER BY ───────────────────
      const orderBySQL = buildSortSQL(input.sorts);

      const cursorClause = input.cursor !== undefined
        ? Prisma.sql`AND "Record"."order" > ${input.cursor}`
        : Prisma.empty;

      const searchClause = input.search
        ? Prisma.sql`AND "Record"."data"::text ILIKE ${`%${input.search}%`}`
        : Prisma.empty;

      const rawRows = await ctx.db.$queryRaw<RawRecordRow[]>`
        SELECT "Record"."id", "Record"."order"
        FROM   "Record"
        WHERE  "Record"."tableId" = ${input.tableId}
        ${cursorClause}
        ${searchClause}
        ${orderBySQL}
        LIMIT  ${input.limit + 1}
      `;

      const sortedIds = rawRows.map((r) => r.id);

      const [records, total] = await Promise.all([
        ctx.db.record.findMany({
          where: {
            id:      { in: sortedIds },
            tableId: input.tableId,
            AND:     filterWhere,
          },
        }),
        ctx.db.record.count({
          where: { tableId: input.tableId, AND: [...filterWhere, ...searchWhere] },
        }),
      ]);

      // re-sort to match raw SQL order
      const idOrder = new Map(sortedIds.map((id, i) => [id, i]));
      const sorted  = records.sort((a, b) => (idOrder.get(a.id) ?? 0) - (idOrder.get(b.id) ?? 0));

      const hasMore    = sortedIds.length > input.limit;
      const page       = hasMore ? sorted.slice(0, input.limit) : sorted;
      const nextCursor = hasMore ? (rawRows[input.limit - 1]?.order ?? null) : null;

      return {
        records:    page.map(parseRecord),
        nextCursor,
        total,
      };
    }),

  // ─── CREATE ─────────────────────────────────────────────────────────────────

  create: protectedProcedure
    .input(RecordCreateInputSchema)
    .output(RowSchema)
    .mutation(async ({ ctx, input }) => {
      const table = await ctx.db.table.findUnique({ where: { id: input.tableId } });
      if (!table) throw new TRPCError({ code: "NOT_FOUND", message: "Table not found" });

      const last = await ctx.db.record.findFirst({
        where:   { tableId: input.tableId },
        orderBy: { order: "desc" },
        select:  { order: true },
      });

      const record = await ctx.db.record.create({
        data: {
          tableId: input.tableId,
          order:   (last?.order ?? -1) + 1,
          data:    input.data,
        },
      });

      return parseRecord(record);
    }),

  // ─── UPDATE CELL ────────────────────────────────────────────────────────────

  updateCell: protectedProcedure
    .input(CellUpdateInputSchema)
    .output(RowSchema)
    .mutation(async ({ ctx, input }) => {
      const record = await ctx.db.record.findUnique({ where: { id: input.recordId } });
      if (!record) throw new TRPCError({ code: "NOT_FOUND", message: "Record not found" });

      const currentData = RowDataSchema.catch({}).parse(record.data);
      const updatedData = { ...currentData, [input.fieldId]: input.value };

      const updated = await ctx.db.record.update({
        where: { id: input.recordId },
        data:  { data: updatedData },
      });

      return parseRecord(updated);
    }),

  // ─── DELETE ─────────────────────────────────────────────────────────────────

  delete: protectedProcedure
    .input(RecordDeleteInputSchema)
    .output(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const record = await ctx.db.record.findUnique({ where: { id: input.id } });
      if (!record) throw new TRPCError({ code: "NOT_FOUND", message: "Record not found" });

      await ctx.db.record.delete({ where: { id: input.id } });
      return { id: input.id };
    }),

  // ─── BULK DELETE ────────────────────────────────────────────────────────────

  bulkDelete: protectedProcedure
    .input(RecordBulkDeleteInputSchema)
    .output(z.object({ deleted: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.record.deleteMany({
        where: { id: { in: input.ids } },
      });
      return { deleted: result.count };
    }),

  // ─── BULK CREATE ─────────────────────────────────────────────────────────────

  bulkCreate: protectedProcedure
    .input(RecordBulkCreateInputSchema)
    .output(z.object({ created: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const table = await ctx.db.table.findUnique({
        where:   { id: input.tableId },
        include: { fields: true },
      });
      if (!table) throw new TRPCError({ code: "NOT_FOUND", message: "Table not found" });

      const last = await ctx.db.record.findFirst({
        where:   { tableId: input.tableId },
        orderBy: { order: "desc" },
        select:  { order: true },
      });

      const startOrder = (last?.order ?? -1) + 1;
      const CHUNK      = 1000;
      let created      = 0;

      for (let i = 0; i < input.count; i += CHUNK) {
        const batchSize = Math.min(CHUNK, input.count - i);

        await ctx.db.record.createMany({
          data: Array.from({ length: batchSize }, (_, j) => ({
            tableId: input.tableId,
            order:   startOrder + i + j,
            data:    Object.fromEntries(
              table.fields.map((f) => [
                f.id,
                fakeCellValue(f.name, f.type as "TEXT" | "NUMBER"),
              ]),
            ),
          })),
        });

        created += batchSize;
      }

      return { created };
    }),
});