import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import {
  FieldCreateInputSchema,
  FieldRenameInputSchema,
  FieldDeleteInputSchema,
  FieldSummarySchema,
} from "~/types";

export const fieldRouter = createTRPCRouter({
  // ─── WRITE ─────────────────────────────────────────────────────────────────

  create: protectedProcedure
    .input(FieldCreateInputSchema)
    .output(FieldSummarySchema)
    .mutation(async ({ ctx, input }) => {
      const table = await ctx.db.table.findUnique({ where: { id: input.tableId } });
      if (!table) throw new TRPCError({ code: "NOT_FOUND", message: "Table not found" });

      const existing = await ctx.db.field.findFirst({
        where: { tableId: input.tableId, name: input.name },
      });
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: `Column "${input.name}" already exists` });
      }

      const last = await ctx.db.field.findFirst({
        where:   { tableId: input.tableId },
        orderBy: { order: "desc" },
        select:  { order: true },
      });

      return ctx.db.field.create({
        data: {
          name:    input.name,
          type:    input.type,
          tableId: input.tableId,
          order:   (last?.order ?? -1) + 1,
        },
        select: { id: true, name: true, type: true, order: true },
      });
    }),

  rename: protectedProcedure
    .input(FieldRenameInputSchema)
    .output(FieldSummarySchema)
    .mutation(async ({ ctx, input }) => {
      const field = await ctx.db.field.findUnique({ where: { id: input.id } });
      if (!field) throw new TRPCError({ code: "NOT_FOUND", message: "Field not found" });

      const clash = await ctx.db.field.findFirst({
        where: { tableId: field.tableId, name: input.name, NOT: { id: input.id } },
      });
      if (clash) {
        throw new TRPCError({ code: "CONFLICT", message: `Column "${input.name}" already exists` });
      }

      return ctx.db.field.update({
        where:  { id: input.id },
        data:   { name: input.name },
        select: { id: true, name: true, type: true, order: true },
      });
    }),

  delete: protectedProcedure
    .input(FieldDeleteInputSchema)
    .output(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const field = await ctx.db.field.findUnique({ where: { id: input.id } });
      if (!field) throw new TRPCError({ code: "NOT_FOUND", message: "Field not found" });

      await ctx.db.field.delete({ where: { id: input.id } });
      return { id: input.id };
    }),
});