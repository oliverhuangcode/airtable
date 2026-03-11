import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  order: z.literal(true).optional()
}).strict();
export const RecordAvgAggregateInputObjectSchema: z.ZodType<Prisma.RecordAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.RecordAvgAggregateInputType>;
export const RecordAvgAggregateInputObjectZodSchema = makeSchema();
