import * as z from 'zod';
export const FieldDeleteManyResultSchema = z.object({
  count: z.number()
});