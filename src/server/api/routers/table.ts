import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { faker } from "@faker-js/faker";
import {
  TableGetByBaseInputSchema,
  TableCreateInputSchema,
  TableRenameInputSchema,
  TableDeleteInputSchema,
  TableReorderInputSchema,
  TableForDetailsSchema,
  TableSummarySchema,
} from "~/types";

const DEFAULT_FIELDS = [
  { name: "Name", type: "TEXT" as const },
  { name: "Notes", type: "TEXT" as const },
  { name: "Amount", type: "NUMBER" as const },
] satisfies { name: string; type: "TEXT" | "NUMBER" }[];

const DEFAULT_ROW_COUNT = 10;

function fakeCellValue(
  fieldName: string,
  fieldType: "TEXT" | "NUMBER",
): string | number {
  if (fieldType === "NUMBER") {
    return faker.number.float({ min: 1, max: 10000, fractionDigits: 2 });
  }
  const name = fieldName.toLowerCase();
  if (name.includes("name")) return faker.person.fullName();
  if (name.includes("email")) return faker.internet.email();
  if (name.includes("company")) return faker.company.name();
  if (name.includes("phone")) return faker.phone.number();
  if (name.includes("status"))
    return faker.helpers.arrayElement(["Active", "Inactive", "Pending"]);
  if (name.includes("note")) return faker.lorem.sentence();
  return faker.lorem.words(2);
}

export const tableRouter = createTRPCRouter({
  getByBase: publicProcedure
    .input(TableGetByBaseInputSchema)
    .output(z.array(TableForDetailsSchema))
    .query(async ({ ctx, input }) => {
      const base = await ctx.db.base.findUnique({
        where: { id: input.baseId },
      });
      if (!base)
        throw new TRPCError({ code: "NOT_FOUND", message: "Base not found" });

      return ctx.db.table.findMany({
        where: { baseId: input.baseId },
        orderBy: { order: "asc" },
        include: { fields: { orderBy: { order: "asc" } } },
      });
    }),

  create: protectedProcedure
    .input(TableCreateInputSchema)
    .output(TableForDetailsSchema)
    .mutation(async ({ ctx, input }) => {
      const base = await ctx.db.base.findUnique({
        where: { id: input.baseId },
      });
      if (!base)
        throw new TRPCError({ code: "NOT_FOUND", message: "Base not found" });

      const last = await ctx.db.table.findFirst({
        where: { baseId: input.baseId },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const table = await ctx.db.table.create({
        data: {
          name: input.name,
          baseId: input.baseId,
          order: (last?.order ?? -1) + 1,
        },
      });

      const fields = await ctx.db.$transaction(
        DEFAULT_FIELDS.map((f, index) =>
          ctx.db.field.create({
            data: {
              name: f.name,
              type: f.type,
              tableId: table.id,
              order: index,
            },
          }),
        ),
      );

      await ctx.db.record.createMany({
        data: Array.from({ length: DEFAULT_ROW_COUNT }, (_, rowIndex) => ({
          tableId: table.id,
          order: rowIndex,
          data: Object.fromEntries(
            fields.map((f) => [
              f.id,
              fakeCellValue(f.name, f.type as "TEXT" | "NUMBER"),
            ]),
          ),
        })),
      });

      return ctx.db.table.findUniqueOrThrow({
        where: { id: table.id },
        include: { fields: { orderBy: { order: "asc" } } },
      });
    }),

  rename: protectedProcedure
    .input(TableRenameInputSchema)
    .output(TableSummarySchema)
    .mutation(async ({ ctx, input }) => {
      const table = await ctx.db.table.findUnique({ where: { id: input.id } });
      if (!table)
        throw new TRPCError({ code: "NOT_FOUND", message: "Table not found" });

      return ctx.db.table.update({
        where: { id: input.id },
        data: { name: input.name },
        select: { id: true, name: true, order: true },
      });
    }),

  delete: protectedProcedure
    .input(TableDeleteInputSchema)
    .output(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const table = await ctx.db.table.findUnique({ where: { id: input.id } });
      if (!table)
        throw new TRPCError({ code: "NOT_FOUND", message: "Table not found" });

      await ctx.db.table.delete({ where: { id: input.id } });
      return { id: input.id };
    }),

  clearData: protectedProcedure
    .input(TableDeleteInputSchema)
    .output(z.object({ deleted: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const table = await ctx.db.table.findUnique({ where: { id: input.id } });
      if (!table)
        throw new TRPCError({ code: "NOT_FOUND", message: "Table not found" });

      const result = await ctx.db.record.deleteMany({
        where: { tableId: input.id },
      });
      return { deleted: result.count };
    }),

  reorder: protectedProcedure
    .input(TableReorderInputSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(
        input.tableIds.map((id, index) =>
          ctx.db.table.update({ where: { id }, data: { order: index } }),
        ),
      );
      return { success: true };
    }),
});
