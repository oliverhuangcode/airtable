import { z } from "zod";

// ─── Row ──────────────────────────────────────────────────────────────────────

export const RowDataSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.null()]),
);
export type RowData = z.infer<typeof RowDataSchema>;

export const RowSchema = z.object({
  id:        z.string(),
  tableId:   z.string(),
  order:     z.number(),
  data:      RowDataSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Row = z.infer<typeof RowSchema>;

export const RecordListOutputSchema = z.object({
  records:    z.array(RowSchema),
  nextCursor: z.number().nullable(),
  total:      z.number(),
});
export type RecordListOutput = z.infer<typeof RecordListOutputSchema>;

// ─── Filter schemas ───────────────────────────────────────────────────────────

export const TextFilterSchema = z.object({
  type:    z.literal("text"),
  fieldId: z.string(),
  op:      z.enum(["contains", "not_contains", "equals", "is_empty", "is_not_empty"]),
  value:   z.string().optional(),
});
export type TextFilter = z.infer<typeof TextFilterSchema>;

export const NumberFilterSchema = z.object({
  type:    z.literal("number"),
  fieldId: z.string(),
  op:      z.enum(["gt", "lt", "equals"]),
  value:   z.number(),
});
export type NumberFilter = z.infer<typeof NumberFilterSchema>;

export const FilterSchema = z.discriminatedUnion("type", [
  TextFilterSchema,
  NumberFilterSchema,
]);
export type Filter = z.infer<typeof FilterSchema>;

// ─── Sort schema ──────────────────────────────────────────────────────────────

export const SortSchema = z.object({
  fieldId:   z.string(),
  fieldType: z.enum(["TEXT", "NUMBER"]),
  direction: z.enum(["asc", "desc"]),
});
export type Sort = z.infer<typeof SortSchema>;

// ─── Input schemas ────────────────────────────────────────────────────────────

export const RecordListInputSchema = z.object({
  tableId: z.string(),
  cursor:  z.number().optional(), 
  limit:   z.number().min(1).max(10000).default(5000),
  filters: z.array(FilterSchema).default([]),
  sorts:   z.array(SortSchema).default([]),
  search:  z.string().default(""),
});
export type RecordListInput = z.infer<typeof RecordListInputSchema>;

export const RecordCreateInputSchema = z.object({
  tableId: z.string(),
  data:    RowDataSchema.default({}),
});
export type RecordCreateInput = z.infer<typeof RecordCreateInputSchema>;

export const CellUpdateInputSchema = z.object({
  recordId: z.string(),
  fieldId:  z.string(),
  value:    z.union([z.string(), z.number(), z.null()]),
});
export type CellUpdateInput = z.infer<typeof CellUpdateInputSchema>;

export const RecordDeleteInputSchema = z.object({ id: z.string() });
export type RecordDeleteInput = z.infer<typeof RecordDeleteInputSchema>;

export const RecordBulkDeleteInputSchema = z.object({
  ids: z.array(z.string()).min(1).max(1000),
});
export type RecordBulkDeleteInput = z.infer<typeof RecordBulkDeleteInputSchema>;

export const RecordBulkCreateInputSchema = z.object({
  tableId: z.string(),
  count:   z.number().min(1).max(100000),
});
export type RecordBulkCreateInput = z.infer<typeof RecordBulkCreateInputSchema>;