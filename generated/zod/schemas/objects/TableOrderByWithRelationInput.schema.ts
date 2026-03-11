import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { BaseOrderByWithRelationInputObjectSchema as BaseOrderByWithRelationInputObjectSchema } from './BaseOrderByWithRelationInput.schema';
import { FieldOrderByRelationAggregateInputObjectSchema as FieldOrderByRelationAggregateInputObjectSchema } from './FieldOrderByRelationAggregateInput.schema';
import { RecordOrderByRelationAggregateInputObjectSchema as RecordOrderByRelationAggregateInputObjectSchema } from './RecordOrderByRelationAggregateInput.schema';
import { ViewOrderByRelationAggregateInputObjectSchema as ViewOrderByRelationAggregateInputObjectSchema } from './ViewOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  baseId: SortOrderSchema.optional(),
  order: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  base: z.lazy(() => BaseOrderByWithRelationInputObjectSchema).optional(),
  fields: z.lazy(() => FieldOrderByRelationAggregateInputObjectSchema).optional(),
  records: z.lazy(() => RecordOrderByRelationAggregateInputObjectSchema).optional(),
  views: z.lazy(() => ViewOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const TableOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.TableOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.TableOrderByWithRelationInput>;
export const TableOrderByWithRelationInputObjectZodSchema = makeSchema();
