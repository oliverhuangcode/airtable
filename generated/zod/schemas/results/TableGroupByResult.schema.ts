import * as z from 'zod';
export const TableGroupByResultSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  baseId: z.string(),
  order: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    name: z.number(),
    baseId: z.number(),
    base: z.number(),
    order: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    fields: z.number(),
    records: z.number(),
    views: z.number()
  }).optional(),
  _sum: z.object({
    order: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    order: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    baseId: z.string().nullable(),
    order: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    baseId: z.string().nullable(),
    order: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));