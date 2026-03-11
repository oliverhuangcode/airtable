import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableArgsObjectSchema as TableArgsObjectSchema } from './TableArgs.schema'

const makeSchema = () => z.object({
  table: z.union([z.boolean(), z.lazy(() => TableArgsObjectSchema)]).optional()
}).strict();
export const ViewIncludeObjectSchema: z.ZodType<Prisma.ViewInclude> = makeSchema() as unknown as z.ZodType<Prisma.ViewInclude>;
export const ViewIncludeObjectZodSchema = makeSchema();
