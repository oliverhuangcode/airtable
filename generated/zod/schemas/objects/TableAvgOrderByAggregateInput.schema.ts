import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  order: SortOrderSchema.optional()
}).strict();
export const TableAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TableAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TableAvgOrderByAggregateInput>;
export const TableAvgOrderByAggregateInputObjectZodSchema = makeSchema();
