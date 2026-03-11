import * as z from 'zod';
export const BaseGroupByResultSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  createdById: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    name: z.number(),
    createdById: z.number(),
    createdBy: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    tables: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    createdById: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    createdById: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));