import { z } from "zod";
import type { TableModelSchema } from "generated/zod/schemas/variants/pure/Table.pure";
import { TableInputSchema } from "generated/zod/schemas/variants/input/Table.input";
import { FieldSummarySchema } from "./field";

export type Table = z.infer<typeof TableModelSchema>;

// Scalar-only subsets — avoids ZodUnknown from Prisma relation fields.
export const TableSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  order: z.number(),
});
export type TableSummary = z.infer<typeof TableSummarySchema>;

export const TableForDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  order: z.number(),
  createdAt: z.date(),
  fields: z.array(FieldSummarySchema),
});
export type TableForDetails = z.infer<typeof TableForDetailsSchema>;

// ─── Input schemas ────────────────────────────────────────────────────────────
export const TableGetByBaseInputSchema = z.object({ baseId: z.string() });
export type TableGetByBaseInput = z.infer<typeof TableGetByBaseInputSchema>;

export const TableCreateInputSchema = TableInputSchema.pick({
  name: true,
  baseId: true,
}).extend({
  name: z.string().min(1, "Table name is required").max(100),
});
export type TableCreateInput = z.infer<typeof TableCreateInputSchema>;

export const TableRenameInputSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Table name is required").max(100),
});
export type TableRenameInput = z.infer<typeof TableRenameInputSchema>;

export const TableDeleteInputSchema = z.object({ id: z.string() });
export type TableDeleteInput = z.infer<typeof TableDeleteInputSchema>;

export const TableReorderInputSchema = z.object({
  baseId: z.string(),
  tableIds: z.array(z.string()).min(1),
});
export type TableReorderInput = z.infer<typeof TableReorderInputSchema>;
