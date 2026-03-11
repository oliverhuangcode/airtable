import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  order: z.literal(true).optional()
}).strict();
export const TableAvgAggregateInputObjectSchema: z.ZodType<Prisma.TableAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TableAvgAggregateInputType>;
export const TableAvgAggregateInputObjectZodSchema = makeSchema();
