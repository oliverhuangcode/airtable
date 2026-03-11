import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableArgsObjectSchema as TableArgsObjectSchema } from './TableArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  tableId: z.boolean().optional(),
  table: z.union([z.boolean(), z.lazy(() => TableArgsObjectSchema)]).optional(),
  order: z.boolean().optional(),
  data: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const RecordSelectObjectSchema: z.ZodType<Prisma.RecordSelect> = makeSchema() as unknown as z.ZodType<Prisma.RecordSelect>;
export const RecordSelectObjectZodSchema = makeSchema();
