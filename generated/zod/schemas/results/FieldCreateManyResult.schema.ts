import * as z from 'zod';
export const FieldCreateManyResultSchema = z.object({
  count: z.number()
});