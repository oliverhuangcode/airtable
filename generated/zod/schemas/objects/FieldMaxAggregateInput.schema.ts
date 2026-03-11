import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  type: z.literal(true).optional(),
  tableId: z.literal(true).optional(),
  order: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const FieldMaxAggregateInputObjectSchema: z.ZodType<Prisma.FieldMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.FieldMaxAggregateInputType>;
export const FieldMaxAggregateInputObjectZodSchema = makeSchema();
