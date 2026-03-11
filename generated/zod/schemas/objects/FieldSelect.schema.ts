import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableArgsObjectSchema as TableArgsObjectSchema } from './TableArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  type: z.boolean().optional(),
  tableId: z.boolean().optional(),
  table: z.union([z.boolean(), z.lazy(() => TableArgsObjectSchema)]).optional(),
  order: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const FieldSelectObjectSchema: z.ZodType<Prisma.FieldSelect> = makeSchema() as unknown as z.ZodType<Prisma.FieldSelect>;
export const FieldSelectObjectZodSchema = makeSchema();
