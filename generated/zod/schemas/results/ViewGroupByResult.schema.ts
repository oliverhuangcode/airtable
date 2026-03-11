import * as z from 'zod';
export const ViewGroupByResultSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  tableId: z.string(),
  filters: z.unknown(),
  sorts: z.unknown(),
  hiddenFields: z.unknown(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    name: z.number(),
    tableId: z.number(),
    table: z.number(),
    filters: z.number(),
    sorts: z.number(),
    hiddenFields: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    tableId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    tableId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));