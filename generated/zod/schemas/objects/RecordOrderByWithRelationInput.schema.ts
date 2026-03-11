import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { TableOrderByWithRelationInputObjectSchema as TableOrderByWithRelationInputObjectSchema } from './TableOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  tableId: SortOrderSchema.optional(),
  order: SortOrderSchema.optional(),
  data: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  table: z.lazy(() => TableOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const RecordOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.RecordOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.RecordOrderByWithRelationInput>;
export const RecordOrderByWithRelationInputObjectZodSchema = makeSchema();
