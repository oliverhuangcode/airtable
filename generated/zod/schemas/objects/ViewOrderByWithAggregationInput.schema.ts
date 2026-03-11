import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { ViewCountOrderByAggregateInputObjectSchema as ViewCountOrderByAggregateInputObjectSchema } from './ViewCountOrderByAggregateInput.schema';
import { ViewMaxOrderByAggregateInputObjectSchema as ViewMaxOrderByAggregateInputObjectSchema } from './ViewMaxOrderByAggregateInput.schema';
import { ViewMinOrderByAggregateInputObjectSchema as ViewMinOrderByAggregateInputObjectSchema } from './ViewMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  tableId: SortOrderSchema.optional(),
  filters: SortOrderSchema.optional(),
  sorts: SortOrderSchema.optional(),
  hiddenFields: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => ViewCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ViewMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ViewMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ViewOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ViewOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.ViewOrderByWithAggregationInput>;
export const ViewOrderByWithAggregationInputObjectZodSchema = makeSchema();
