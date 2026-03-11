import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { TableOrderByWithRelationInputObjectSchema as TableOrderByWithRelationInputObjectSchema } from './TableOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  tableId: SortOrderSchema.optional(),
  filters: SortOrderSchema.optional(),
  sorts: SortOrderSchema.optional(),
  hiddenFields: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  table: z.lazy(() => TableOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const ViewOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ViewOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.ViewOrderByWithRelationInput>;
export const ViewOrderByWithRelationInputObjectZodSchema = makeSchema();
