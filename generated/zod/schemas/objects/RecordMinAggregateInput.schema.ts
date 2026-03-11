import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  tableId: z.literal(true).optional(),
  order: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const RecordMinAggregateInputObjectSchema: z.ZodType<Prisma.RecordMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.RecordMinAggregateInputType>;
export const RecordMinAggregateInputObjectZodSchema = makeSchema();
