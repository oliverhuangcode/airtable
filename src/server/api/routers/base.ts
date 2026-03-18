import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  BaseGetByIdInputSchema,
  BaseCreateInputSchema,
  BaseRenameInputSchema,
  BaseDeleteInputSchema,
  BaseForListSchema,
  BaseForDetailsSchema,
} from "~/types";
import { z } from "zod";

export const baseRouter = createTRPCRouter({
  getAll: publicProcedure
    .output(z.array(BaseForListSchema))
    .query(async ({ ctx }) => {
      const bases = await ctx.db.base.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          createdBy: { select: { id: true, name: true } },
          _count: { select: { tables: true } },
        },
      });

      return bases.map((b) => ({
        id: b.id,
        name: b.name,
        createdAt: b.createdAt,
        tableCount: b._count.tables,
        createdBy: { id: b.createdBy.id, name: b.createdBy.name ?? "Unknown" },
      }));
    }),

  getById: publicProcedure
    .input(BaseGetByIdInputSchema)
    .output(BaseForDetailsSchema)
    .query(async ({ ctx, input }) => {
      const base = await ctx.db.base.findUnique({
        where: { id: input.id },
        include: {
          createdBy: { select: { id: true, name: true } },
          tables: {
            orderBy: { order: "asc" },
            include: { fields: { orderBy: { order: "asc" } } },
          },
        },
      });

      if (!base)
        throw new TRPCError({ code: "NOT_FOUND", message: "Base not found" });

      return {
        ...base,
        createdBy: {
          id: base.createdBy.id,
          name: base.createdBy.name ?? "Unknown",
        },
      };
    }),

  create: protectedProcedure
    .input(BaseCreateInputSchema)
    .output(BaseForListSchema)
    .mutation(async ({ ctx, input }) => {
      const base = await ctx.db.base.create({
        data: {
          name: input.name,
          createdById: ctx.session.user.id,
        },
        include: {
          createdBy: { select: { id: true, name: true } },
          _count: { select: { tables: true } },
        },
      });

      return {
        id: base.id,
        name: base.name,
        createdAt: base.createdAt,
        tableCount: base._count.tables,
        createdBy: {
          id: base.createdBy.id,
          name: base.createdBy.name ?? "Unknown",
        },
      };
    }),

  rename: protectedProcedure
    .input(BaseRenameInputSchema)
    .output(BaseForListSchema)
    .mutation(async ({ ctx, input }) => {
      const base = await ctx.db.base.findUnique({ where: { id: input.id } });
      if (!base)
        throw new TRPCError({ code: "NOT_FOUND", message: "Base not found" });

      const updated = await ctx.db.base.update({
        where: { id: input.id },
        data: { name: input.name },
        include: {
          createdBy: { select: { id: true, name: true } },
          _count: { select: { tables: true } },
        },
      });

      return {
        id: updated.id,
        name: updated.name,
        createdAt: updated.createdAt,
        tableCount: updated._count.tables,
        createdBy: {
          id: updated.createdBy.id,
          name: updated.createdBy.name ?? "Unknown",
        },
      };
    }),

  delete: protectedProcedure
    .input(BaseDeleteInputSchema)
    .output(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const base = await ctx.db.base.findUnique({ where: { id: input.id } });
      if (!base)
        throw new TRPCError({ code: "NOT_FOUND", message: "Base not found" });

      await ctx.db.base.delete({ where: { id: input.id } });
      return { id: input.id };
    }),
});
