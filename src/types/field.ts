import { z } from "zod";

export const FieldTypeSchema = z.enum(["TEXT", "NUMBER"]);
export type FieldType = z.infer<typeof FieldTypeSchema>;

export const FieldSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: FieldTypeSchema,
  order: z.number(),
});
export type FieldSummary = z.infer<typeof FieldSummarySchema>;

export const FieldCreateInputSchema = z.object({
  tableId: z.string(),
  name: z.string().min(1, "Column name is required").max(100),
  type: FieldTypeSchema.default("TEXT"),
});
export type FieldCreateInput = z.infer<typeof FieldCreateInputSchema>;

export const FieldRenameInputSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Column name is required").max(100),
});
export type FieldRenameInput = z.infer<typeof FieldRenameInputSchema>;

export const FieldDeleteInputSchema = z.object({ id: z.string() });
export type FieldDeleteInput = z.infer<typeof FieldDeleteInputSchema>;
