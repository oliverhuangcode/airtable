import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { UserOrderByWithRelationInputObjectSchema as UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema';
import { TableOrderByRelationAggregateInputObjectSchema as TableOrderByRelationAggregateInputObjectSchema } from './TableOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  createdById: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  createdBy: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  tables: z.lazy(() => TableOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const BaseOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.BaseOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.BaseOrderByWithRelationInput>;
export const BaseOrderByWithRelationInputObjectZodSchema = makeSchema();
