import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const ViewOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.ViewOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ViewOrderByRelationAggregateInput>;
export const ViewOrderByRelationAggregateInputObjectZodSchema = makeSchema();
