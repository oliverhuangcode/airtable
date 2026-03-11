import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { FieldCountOrderByAggregateInputObjectSchema as FieldCountOrderByAggregateInputObjectSchema } from './FieldCountOrderByAggregateInput.schema';
import { FieldAvgOrderByAggregateInputObjectSchema as FieldAvgOrderByAggregateInputObjectSchema } from './FieldAvgOrderByAggregateInput.schema';
import { FieldMaxOrderByAggregateInputObjectSchema as FieldMaxOrderByAggregateInputObjectSchema } from './FieldMaxOrderByAggregateInput.schema';
import { FieldMinOrderByAggregateInputObjectSchema as FieldMinOrderByAggregateInputObjectSchema } from './FieldMinOrderByAggregateInput.schema';
import { FieldSumOrderByAggregateInputObjectSchema as FieldSumOrderByAggregateInputObjectSchema } from './FieldSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  tableId: SortOrderSchema.optional(),
  order: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => FieldCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => FieldAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => FieldMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => FieldMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => FieldSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const FieldOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.FieldOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.FieldOrderByWithAggregationInput>;
export const FieldOrderByWithAggregationInputObjectZodSchema = makeSchema();
