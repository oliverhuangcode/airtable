import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  tableId: z.literal(true).optional(),
  order: z.literal(true).optional(),
  data: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const RecordCountAggregateInputObjectSchema: z.ZodType<Prisma.RecordCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.RecordCountAggregateInputType>;
export const RecordCountAggregateInputObjectZodSchema = makeSchema();
