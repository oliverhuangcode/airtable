import * as z from 'zod';
export const BaseDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  createdById: z.string(),
  createdBy: z.unknown(),
  createdAt: z.date(),
  updatedAt: z.date(),
  tables: z.array(z.unknown())
}));