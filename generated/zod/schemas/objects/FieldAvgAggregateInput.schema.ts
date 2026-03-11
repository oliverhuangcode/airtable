import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  order: z.literal(true).optional()
}).strict();
export const FieldAvgAggregateInputObjectSchema: z.ZodType<Prisma.FieldAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.FieldAvgAggregateInputType>;
export const FieldAvgAggregateInputObjectZodSchema = makeSchema();
