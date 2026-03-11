import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  order: SortOrderSchema.optional()
}).strict();
export const RecordAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RecordAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.RecordAvgOrderByAggregateInput>;
export const RecordAvgOrderByAggregateInputObjectZodSchema = makeSchema();
