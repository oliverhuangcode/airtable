import * as z from 'zod';
export const TableCreateResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  baseId: z.string(),
  base: z.unknown(),
  order: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  fields: z.array(z.unknown()),
  records: z.array(z.unknown()),
  views: z.array(z.unknown())
});