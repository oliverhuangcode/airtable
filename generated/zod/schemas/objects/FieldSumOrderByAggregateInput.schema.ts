import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  order: SortOrderSchema.optional()
}).strict();
export const FieldSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.FieldSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.FieldSumOrderByAggregateInput>;
export const FieldSumOrderByAggregateInputObjectZodSchema = makeSchema();
