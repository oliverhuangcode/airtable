import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  tableId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ViewMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ViewMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ViewMinOrderByAggregateInput>;
export const ViewMinOrderByAggregateInputObjectZodSchema = makeSchema();
