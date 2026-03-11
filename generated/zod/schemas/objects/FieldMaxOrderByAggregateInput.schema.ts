import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  tableId: SortOrderSchema.optional(),
  order: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const FieldMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.FieldMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.FieldMaxOrderByAggregateInput>;
export const FieldMaxOrderByAggregateInputObjectZodSchema = makeSchema();
