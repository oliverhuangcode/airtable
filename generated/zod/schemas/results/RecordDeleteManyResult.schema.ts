import * as z from 'zod';
export const RecordDeleteManyResultSchema = z.object({
  count: z.number()
});