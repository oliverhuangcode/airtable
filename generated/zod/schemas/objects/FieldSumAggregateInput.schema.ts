import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  order: z.literal(true).optional()
}).strict();
export const FieldSumAggregateInputObjectSchema: z.ZodType<Prisma.FieldSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.FieldSumAggregateInputType>;
export const FieldSumAggregateInputObjectZodSchema = makeSchema();
