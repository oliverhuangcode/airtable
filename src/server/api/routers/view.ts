import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { FilterSchema, SortSchema } from "~/types";
import {
  ViewSchema,
  ViewSummarySchema,
  ViewGetByTableInputSchema,
  ViewGetByIdInputSchema,
  ViewCreateInputSchema,
  ViewRenameInputSchema,
  ViewUpdateConfigInputSchema,
  ViewDeleteInputSchema,
} from "~/types";

// Prisma returns Json columns as `unknown`. Parses and validates each field;
// .catch([]) falls back to an empty array for malformed stored data.
function parseViewConfig(view: {
  id: string;
  name: string;
  tableId: string;
  filters: unknown;
  sorts: unknown;
  hiddenFields: unknown;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: view.id,
    name: view.name,
    tableId: view.tableId,
    createdAt: view.createdAt,
    updatedAt: view.updatedAt,
    filters: z.array(FilterSchema).catch([]).parse(view.filters),
    sorts: z.array(SortSchema).catch([]).parse(view.sorts),
    hiddenFields: z.array(z.string()).catch([]).parse(view.hiddenFields),
  };
}

export const viewRouter = createTRPCRouter({
  // Lightweight list for sidebar — no filter/sort config included.
  getByTable: publicProcedure
    .input(ViewGetByTableInputSchema)
    .output(z.array(ViewSummarySchema))
    .query(async ({ ctx, input }) => {
      const table = await ctx.db.table.findUnique({
        where: { id: input.tableId },
      });
      if (!table)
        throw new TRPCError({ code: "NOT_FOUND", message: "Table not found" });

      return ctx.db.view.findMany({
        where: { tableId: input.tableId },
        orderBy: { createdAt: "asc" },
        select: { id: true, name: true, tableId: true },
      });
    }),

  getById: publicProcedure
    .input(ViewGetByIdInputSchema)
    .output(ViewSchema)
    .query(async ({ ctx, input }) => {
      const view = await ctx.db.view.findUnique({ where: { id: input.id } });
      if (!view)
        throw new TRPCError({ code: "NOT_FOUND", message: "View not found" });

      return parseViewConfig(view);
    }),

  create: protectedProcedure
    .input(ViewCreateInputSchema)
    .output(ViewSchema)
    .mutation(async ({ ctx, input }) => {
      const table = await ctx.db.table.findUnique({
        where: { id: input.tableId },
      });
      if (!table)
        throw new TRPCError({ code: "NOT_FOUND", message: "Table not found" });

      const view = await ctx.db.view.create({
        data: {
          name: input.name,
          tableId: input.tableId,
          filters: [],
          sorts: [],
          hiddenFields: [],
        },
      });

      return parseViewConfig(view);
    }),

  rename: protectedProcedure
    .input(ViewRenameInputSchema)
    .output(ViewSummarySchema)
    .mutation(async ({ ctx, input }) => {
      const view = await ctx.db.view.findUnique({ where: { id: input.id } });
      if (!view)
        throw new TRPCError({ code: "NOT_FOUND", message: "View not found" });

      return ctx.db.view.update({
        where: { id: input.id },
        data: { name: input.name },
        select: { id: true, name: true, tableId: true },
      });
    }),

  // Partial update — only fields present in input are written to the database.
  updateConfig: protectedProcedure
    .input(ViewUpdateConfigInputSchema)
    .output(ViewSchema)
    .mutation(async ({ ctx, input }) => {
      const view = await ctx.db.view.findUnique({ where: { id: input.id } });
      if (!view)
        throw new TRPCError({ code: "NOT_FOUND", message: "View not found" });

      const updated = await ctx.db.view.update({
        where: { id: input.id },
        data: {
          ...(input.filters !== undefined && { filters: input.filters }),
          ...(input.sorts !== undefined && { sorts: input.sorts }),
          ...(input.hiddenFields !== undefined && {
            hiddenFields: input.hiddenFields,
          }),
        },
      });

      return parseViewConfig(updated);
    }),

  delete: protectedProcedure
    .input(ViewDeleteInputSchema)
    .output(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const view = await ctx.db.view.findUnique({ where: { id: input.id } });
      if (!view)
        throw new TRPCError({ code: "NOT_FOUND", message: "View not found" });

      await ctx.db.view.delete({ where: { id: input.id } });
      return { id: input.id };
    }),
});
