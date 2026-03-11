import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const FieldOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.FieldOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.FieldOrderByRelationAggregateInput>;
export const FieldOrderByRelationAggregateInputObjectZodSchema = makeSchema();
