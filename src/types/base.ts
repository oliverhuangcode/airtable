import { z } from "zod";
import type { BaseModelSchema } from "generated/zod/schemas/variants/pure/Base.pure";
import { UserSummarySchema } from "./user";
import { TableSummarySchema } from "./table";

// ─── Base type ────────────────────────────────────────────────────────────────
export type Base = z.infer<typeof BaseModelSchema>;

// ─── Views ────────────────────────────────────────────────────────────────────
// Build from scalars only — Base has tables/createdBy relations → ZodUnknown
export const BaseForListSchema = z.object({
  id:         z.string(),
  name:       z.string(),
  createdAt:  z.date(),
  tableCount: z.number(),
  createdBy:  UserSummarySchema,
});
export type BaseForList = z.infer<typeof BaseForListSchema>;

export const BaseForDetailsSchema = z.object({
  id:        z.string(),
  name:      z.string(),
  createdAt: z.date(),
  tables:    z.array(TableSummarySchema),
  createdBy: UserSummarySchema,
});
export type BaseForDetails = z.infer<typeof BaseForDetailsSchema>;

// ─── Input schemas ────────────────────────────────────────────────────────────
export const BaseGetByIdInputSchema = z.object({ id: z.string() });
export type BaseGetByIdInput = z.infer<typeof BaseGetByIdInputSchema>;

export const BaseCreateInputSchema = z.object({
  name: z.string().min(1, "Base name is required").max(100),
});
export type BaseCreateInput = z.infer<typeof BaseCreateInputSchema>;

export const BaseRenameInputSchema = z.object({
  id:   z.string(),
  name: z.string().min(1, "Base name is required").max(100),
});
export type BaseRenameInput = z.infer<typeof BaseRenameInputSchema>;

export const BaseDeleteInputSchema = z.object({ id: z.string() });
export type BaseDeleteInput = z.infer<typeof BaseDeleteInputSchema>;