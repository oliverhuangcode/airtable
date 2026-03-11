import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableArgsObjectSchema as TableArgsObjectSchema } from './TableArgs.schema'

const makeSchema = () => z.object({
  table: z.union([z.boolean(), z.lazy(() => TableArgsObjectSchema)]).optional()
}).strict();
export const FieldIncludeObjectSchema: z.ZodType<Prisma.FieldInclude> = makeSchema() as unknown as z.ZodType<Prisma.FieldInclude>;
export const FieldIncludeObjectZodSchema = makeSchema();
