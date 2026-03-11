import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  tableId: SortOrderSchema.optional(),
  filters: SortOrderSchema.optional(),
  sorts: SortOrderSchema.optional(),
  hiddenFields: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ViewCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ViewCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ViewCountOrderByAggregateInput>;
export const ViewCountOrderByAggregateInputObjectZodSchema = makeSchema();
