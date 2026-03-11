import * as z from 'zod';
export const ViewDeleteManyResultSchema = z.object({
  count: z.number()
});