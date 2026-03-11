import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  tableId: SortOrderSchema.optional(),
  order: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const RecordMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RecordMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.RecordMaxOrderByAggregateInput>;
export const RecordMaxOrderByAggregateInputObjectZodSchema = makeSchema();
