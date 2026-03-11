import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { TableCountOrderByAggregateInputObjectSchema as TableCountOrderByAggregateInputObjectSchema } from './TableCountOrderByAggregateInput.schema';
import { TableAvgOrderByAggregateInputObjectSchema as TableAvgOrderByAggregateInputObjectSchema } from './TableAvgOrderByAggregateInput.schema';
import { TableMaxOrderByAggregateInputObjectSchema as TableMaxOrderByAggregateInputObjectSchema } from './TableMaxOrderByAggregateInput.schema';
import { TableMinOrderByAggregateInputObjectSchema as TableMinOrderByAggregateInputObjectSchema } from './TableMinOrderByAggregateInput.schema';
import { TableSumOrderByAggregateInputObjectSchema as TableSumOrderByAggregateInputObjectSchema } from './TableSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  baseId: SortOrderSchema.optional(),
  order: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => TableCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => TableAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => TableMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => TableMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => TableSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const TableOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.TableOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.TableOrderByWithAggregationInput>;
export const TableOrderByWithAggregationInputObjectZodSchema = makeSchema();
