// src/types/base.types.ts
import { z } from "zod";
import { UserSummarySchema } from "./user";
import { TableSummarySchema, TableForDetailsSchema } from "./table";

// ─── List view — used in BasesView dashboard ──────────────────────────────────
export const BaseForListSchema = z.object({
  id:         z.string(),
  name:       z.string(),
  createdAt:  z.date(),
  tableCount: z.number(),
  createdBy:  UserSummarySchema,
});
export type BaseForList = z.infer<typeof BaseForListSchema>;

// ─── Detail view — used in BaseView (includes fields on each table) ───────────
// Uses TableForDetailsSchema so activeTable.fields is always available
export const BaseForDetailsSchema = z.object({
  id:        z.string(),
  name:      z.string(),
  createdAt: z.date(),
  tables:    z.array(TableForDetailsSchema), // ← not TableSummarySchema
  createdBy: UserSummarySchema,
});
export type BaseForDetails = z.infer<typeof BaseForDetailsSchema>;

// ─── Input schemas ────────────────────────────────────────────────────────────
export const BaseGetByIdInputSchema = z.object({
  id: z.string(),
});
export type BaseGetByIdInput = z.infer<typeof BaseGetByIdInputSchema>;

export const BaseCreateInputSchema = z.object({
  name: z.string().min(1, "Base name is required").max(100),
});
export type BaseCreateInput = z.infer<typeof BaseCreateInputSchema>;

export const BaseRenameInputSchema = z.object({
  id:   z.string(),
  name: z.string().min(1).max(100),
});
export type BaseRenameInput = z.infer<typeof BaseRenameInputSchema>;

export const BaseDeleteInputSchema = z.object({
  id: z.string(),
});
export type BaseDeleteInput = z.infer<typeof BaseDeleteInputSchema>;