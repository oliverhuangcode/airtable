import { z } from "zod";
import { FilterSchema, SortSchema } from "./record";

// ─── View model ───────────────────────────────────────────────────────────────
export const ViewSchema = z.object({
  id:           z.string(),
  name:         z.string(),
  tableId:      z.string(),
  filters:      z.array(FilterSchema),
  sorts:        z.array(SortSchema),
  hiddenFields: z.array(z.string()), // array of fieldIds
  createdAt:    z.date(),
  updatedAt:    z.date(),
});
export type View = z.infer<typeof ViewSchema>;

// ─── Summary — for sidebar/tab list ──────────────────────────────────────────
export const ViewSummarySchema = z.object({
  id:      z.string(),
  name:    z.string(),
  tableId: z.string(),
});
export type ViewSummary = z.infer<typeof ViewSummarySchema>;

// ─── Input schemas ────────────────────────────────────────────────────────────
export const ViewGetByTableInputSchema = z.object({
  tableId: z.string(),
});
export type ViewGetByTableInput = z.infer<typeof ViewGetByTableInputSchema>;

export const ViewGetByIdInputSchema = z.object({
  id: z.string(),
});
export type ViewGetByIdInput = z.infer<typeof ViewGetByIdInputSchema>;

export const ViewCreateInputSchema = z.object({
  tableId: z.string(),
  name:    z.string().min(1, "View name is required").max(100),
});
export type ViewCreateInput = z.infer<typeof ViewCreateInputSchema>;

export const ViewRenameInputSchema = z.object({
  id:   z.string(),
  name: z.string().min(1, "View name is required").max(100),
});
export type ViewRenameInput = z.infer<typeof ViewRenameInputSchema>;

export const ViewUpdateConfigInputSchema = z.object({
  id:           z.string(),
  filters:      z.array(FilterSchema).optional(),
  sorts:        z.array(SortSchema).optional(),
  hiddenFields: z.array(z.string()).optional(),
});
export type ViewUpdateConfigInput = z.infer<typeof ViewUpdateConfigInputSchema>;

export const ViewDeleteInputSchema = z.object({
  id: z.string(),
});
export type ViewDeleteInput = z.infer<typeof ViewDeleteInputSchema>;