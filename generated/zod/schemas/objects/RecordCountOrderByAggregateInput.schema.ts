import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  tableId: SortOrderSchema.optional(),
  order: SortOrderSchema.optional(),
  data: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const RecordCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RecordCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.RecordCountOrderByAggregateInput>;
export const RecordCountOrderByAggregateInputObjectZodSchema = makeSchema();
