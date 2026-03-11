import * as z from 'zod';
export const RecordCreateResultSchema = z.object({
  id: z.string(),
  tableId: z.string(),
  table: z.unknown(),
  order: z.number().int(),
  data: z.unknown(),
  createdAt: z.date(),
  updatedAt: z.date()
});