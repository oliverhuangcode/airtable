import * as z from 'zod';
export const FieldDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  type: z.unknown(),
  tableId: z.string(),
  table: z.unknown(),
  order: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date()
}));