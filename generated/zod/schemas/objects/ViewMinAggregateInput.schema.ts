import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  tableId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const ViewMinAggregateInputObjectSchema: z.ZodType<Prisma.ViewMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ViewMinAggregateInputType>;
export const ViewMinAggregateInputObjectZodSchema = makeSchema();
