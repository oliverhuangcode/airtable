import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
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

// ─── Helper: parse Json columns from DB into typed arrays ─────────────────────
// Prisma returns Json fields as `unknown` — parse + validate with zod
// .catch([]) degrades gracefully if DB has malformed data

function parseViewConfig(view: {
  id:           string;
  name:         string;
  tableId:      string;
  filters:      unknown;
  sorts:        unknown;
  hiddenFields: unknown;
  createdAt:    Date;
  updatedAt:    Date;
}) {
  return {
    id:           view.id,
    name:         view.name,
    tableId:      view.tableId,
    createdAt:    view.createdAt,
    updatedAt:    view.updatedAt,
    filters:      z.array(FilterSchema).catch([]).parse(view.filters),
    sorts:        z.array(SortSchema).catch([]).parse(view.sorts),
    hiddenFields: z.array(z.string()).catch([]).parse(view.hiddenFields),
  };
}

export const viewRouter = createTRPCRouter({
  // ─── READ ───────────────────────────────────────────────────────────────────

  // Lightweight list for sidebar — no config payload
  getByTable: publicProcedure
    .input(ViewGetByTableInputSchema)
    .output(z.array(ViewSummarySchema))
    .query(async ({ ctx, input }) => {
      const table = await ctx.db.table.findUnique({ where: { id: input.tableId } });
      if (!table) throw new TRPCError({ code: "NOT_FOUND", message: "Table not found" });

      return ctx.db.view.findMany({
        where:   { tableId: input.tableId },
        orderBy: { createdAt: "asc" },
        select:  { id: true, name: true, tableId: true },
      });
    }),

  // Full config — called when user switches to a view
  getById: publicProcedure
    .input(ViewGetByIdInputSchema)
    .output(ViewSchema)
    .query(async ({ ctx, input }) => {
      const view = await ctx.db.view.findUnique({ where: { id: input.id } });
      if (!view) throw new TRPCError({ code: "NOT_FOUND", message: "View not found" });

      return parseViewConfig(view);
    }),

  // ─── WRITE ──────────────────────────────────────────────────────────────────

  // Creates a blank view with empty config
  create: protectedProcedure
    .input(ViewCreateInputSchema)
    .output(ViewSchema)
    .mutation(async ({ ctx, input }) => {
      const table = await ctx.db.table.findUnique({ where: { id: input.tableId } });
      if (!table) throw new TRPCError({ code: "NOT_FOUND", message: "Table not found" });

      const view = await ctx.db.view.create({
        data: {
          name:         input.name,
          tableId:      input.tableId,
          filters:      [],
          sorts:        [],
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
      if (!view) throw new TRPCError({ code: "NOT_FOUND", message: "View not found" });

      return ctx.db.view.update({
        where:  { id: input.id },
        data:   { name: input.name },
        select: { id: true, name: true, tableId: true },
      });
    }),

  // Main workhorse — called whenever user changes filters, sorts, or hidden columns
  // Only updates fields that are passed in — patch one thing at a time
  updateConfig: protectedProcedure
    .input(ViewUpdateConfigInputSchema)
    .output(ViewSchema)
    .mutation(async ({ ctx, input }) => {
      const view = await ctx.db.view.findUnique({ where: { id: input.id } });
      if (!view) throw new TRPCError({ code: "NOT_FOUND", message: "View not found" });

      const updated = await ctx.db.view.update({
        where: { id: input.id },
        data: {
          ...(input.filters      !== undefined && { filters:      input.filters      }),
          ...(input.sorts        !== undefined && { sorts:        input.sorts        }),
          ...(input.hiddenFields !== undefined && { hiddenFields: input.hiddenFields }),
        },
      });

      return parseViewConfig(updated);
    }),

  delete: protectedProcedure
    .input(ViewDeleteInputSchema)
    .output(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const view = await ctx.db.view.findUnique({ where: { id: input.id } });
      if (!view) throw new TRPCError({ code: "NOT_FOUND", message: "View not found" });

      await ctx.db.view.delete({ where: { id: input.id } });
      return { id: input.id };
    }),
});