import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { RecordCountOrderByAggregateInputObjectSchema as RecordCountOrderByAggregateInputObjectSchema } from './RecordCountOrderByAggregateInput.schema';
import { RecordAvgOrderByAggregateInputObjectSchema as RecordAvgOrderByAggregateInputObjectSchema } from './RecordAvgOrderByAggregateInput.schema';
import { RecordMaxOrderByAggregateInputObjectSchema as RecordMaxOrderByAggregateInputObjectSchema } from './RecordMaxOrderByAggregateInput.schema';
import { RecordMinOrderByAggregateInputObjectSchema as RecordMinOrderByAggregateInputObjectSchema } from './RecordMinOrderByAggregateInput.schema';
import { RecordSumOrderByAggregateInputObjectSchema as RecordSumOrderByAggregateInputObjectSchema } from './RecordSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  tableId: SortOrderSchema.optional(),
  order: SortOrderSchema.optional(),
  data: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => RecordCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => RecordAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => RecordMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => RecordMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => RecordSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const RecordOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.RecordOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.RecordOrderByWithAggregationInput>;
export const RecordOrderByWithAggregationInputObjectZodSchema = makeSchema();
