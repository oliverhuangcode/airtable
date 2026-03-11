import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const BaseCreateManyCreatedByInputObjectSchema: z.ZodType<Prisma.BaseCreateManyCreatedByInput> = makeSchema() as unknown as z.ZodType<Prisma.BaseCreateManyCreatedByInput>;
export const BaseCreateManyCreatedByInputObjectZodSchema = makeSchema();
