import * as z from 'zod';
export const RecordCreateManyResultSchema = z.object({
  count: z.number()
});