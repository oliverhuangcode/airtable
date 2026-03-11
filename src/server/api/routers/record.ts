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

type RawRecordRow = { id: string; order: number };

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

function buildFilterWhere(filters: Filter[]): Prisma.RecordWhereInput[] {
  return filters.map((f) => {
    const key = f.fieldId;
    if (f.type === "text") {
      switch (f.op) {
        case "contains":     return { data: { path: [key], string_contains: f.value ?? "" } };
        case "not_contains": return { NOT: { data: { path: [key], string_contains: f.value ?? "" } } };
        case "equals":       return { data: { path: [key], equals: f.value ?? "" } };
        case "is_empty":     return { OR:  [{ data: { path: [key], equals: Prisma.JsonNull } }, { data: { path: [key], equals: "" } }] };
        case "is_not_empty": return { AND: [{ NOT: { data: { path: [key], equals: Prisma.JsonNull } } }, { NOT: { data: { path: [key], equals: "" } } }] };
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

// All queries — both sorted and unsorted — go through raw SQL so search
// consistently uses ILIKE on the cast JSON text, not Prisma's string_contains
function buildRawQuery(
  tableId: string,
  sorts: Sort[],
  search: string,
  cursor: number | undefined,
  limit: number,
): Prisma.Sql {
  const conditions: Prisma.Sql[] = [
    Prisma.sql`"Record"."tableId" = ${tableId}`,
  ];

  if (cursor !== undefined) {
    conditions.push(Prisma.sql`"Record"."order" > ${cursor}`);
  }

  if (search) {
    // Cast the whole JSON blob to text and ILIKE search across all values
    conditions.push(Prisma.sql`"Record"."data"::text ILIKE ${"%" + search + "%"}`);
  }

  const whereSQL = conditions.reduce(
    (acc, cond, i) => i === 0 ? cond : Prisma.sql`${acc} AND ${cond}`,
  );

  // ORDER BY — always raw to avoid $N parameter errors
  let orderSQL: string;
  if (sorts.length === 0) {
    orderSQL = `"Record"."order" ASC`;
  } else {
    const clauses = sorts.map((sort) => {
      const dir     = sort.direction === "asc" ? "ASC" : "DESC";
      const fieldId = sort.fieldId;
      return sort.fieldType === "NUMBER"
        ? `("Record"."data"->>'${fieldId}')::numeric ${dir} NULLS LAST`
        : `"Record"."data"->>'${fieldId}' ${dir} NULLS LAST`;
    });
    clauses.push(`"Record"."order" ASC`);
    orderSQL = clauses.join(", ");
  }

  return Prisma.sql`
    SELECT "Record"."id", "Record"."order"
    FROM   "Record"
    WHERE  ${whereSQL}
    ORDER BY ${Prisma.raw(orderSQL)}
    LIMIT  ${Prisma.raw(String(limit + 1))}
  `;
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

export const recordRouter = createTRPCRouter({

  list: publicProcedure
    .input(RecordListInputSchema)
    .output(RecordListOutputSchema)
    .query(async ({ ctx, input }) => {
      const table = await ctx.db.table.findUnique({ where: { id: input.tableId } });
      if (!table) throw new TRPCError({ code: "NOT_FOUND", message: "Table not found" });

      const filterWhere = buildFilterWhere(input.filters);

      // ── Single path: always use raw SQL for consistent search behaviour ────
      const query = buildRawQuery(
        input.tableId,
        input.sorts,
        input.search,
        input.cursor,
        input.limit,
      );

      const rawRows = await ctx.db.$queryRaw<RawRecordRow[]>(query);
      const sortedIds = rawRows.map((r) => r.id);

      // Fetch full records + total count in parallel
      const [records, total] = await Promise.all([
        ctx.db.record.findMany({
          where: {
            id:      { in: sortedIds },
            tableId: input.tableId,
            AND:     filterWhere,
          },
        }),
        // Count uses raw SQL too so search count is also correct
        ctx.db.$queryRaw<[{ count: bigint }]>(
          Prisma.sql`
            SELECT COUNT(*)::bigint as count
            FROM "Record"
            WHERE "Record"."tableId" = ${input.tableId}
            ${input.search ? Prisma.sql`AND "Record"."data"::text ILIKE ${"%" + input.search + "%"}` : Prisma.empty}
          `
        ),
      ]);

      const totalCount = Number(total[0]?.count ?? 0);

      // Re-sort fetched records to match raw SQL order
      const idOrder = new Map(sortedIds.map((id, i) => [id, i]));
      const sorted  = records.sort((a, b) => (idOrder.get(a.id) ?? 0) - (idOrder.get(b.id) ?? 0));

      const hasMore    = sortedIds.length > input.limit;
      const page       = hasMore ? sorted.slice(0, input.limit) : sorted;
      const nextCursor = hasMore ? (rawRows[input.limit - 1]?.order ?? null) : null;

      return { records: page.map(parseRecord), nextCursor, total: totalCount };
    }),

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
        data: { tableId: input.tableId, order: (last?.order ?? -1) + 1, data: input.data },
      });

      return parseRecord(record);
    }),

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

  delete: protectedProcedure
    .input(RecordDeleteInputSchema)
    .output(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const record = await ctx.db.record.findUnique({ where: { id: input.id } });
      if (!record) throw new TRPCError({ code: "NOT_FOUND", message: "Record not found" });

      await ctx.db.record.delete({ where: { id: input.id } });
      return { id: input.id };
    }),

  bulkDelete: protectedProcedure
    .input(RecordBulkDeleteInputSchema)
    .output(z.object({ deleted: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.record.deleteMany({ where: { id: { in: input.ids } } });
      return { deleted: result.count };
    }),

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
              table.fields.map((f) => [f.id, fakeCellValue(f.name, f.type as "TEXT" | "NUMBER")]),
            ),
          })),
        });
        created += batchSize;
      }

      return { created };
    }),
});