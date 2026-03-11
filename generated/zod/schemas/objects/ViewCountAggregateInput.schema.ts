import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  tableId: z.literal(true).optional(),
  filters: z.literal(true).optional(),
  sorts: z.literal(true).optional(),
  hiddenFields: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const ViewCountAggregateInputObjectSchema: z.ZodType<Prisma.ViewCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ViewCountAggregateInputType>;
export const ViewCountAggregateInputObjectZodSchema = makeSchema();
