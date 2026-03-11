import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  order: z.literal(true).optional()
}).strict();
export const RecordSumAggregateInputObjectSchema: z.ZodType<Prisma.RecordSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.RecordSumAggregateInputType>;
export const RecordSumAggregateInputObjectZodSchema = makeSchema();
