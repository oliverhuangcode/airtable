import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  order: SortOrderSchema.optional()
}).strict();
export const RecordSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RecordSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.RecordSumOrderByAggregateInput>;
export const RecordSumOrderByAggregateInputObjectZodSchema = makeSchema();
