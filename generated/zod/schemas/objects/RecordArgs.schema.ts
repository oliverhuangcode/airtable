import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RecordSelectObjectSchema as RecordSelectObjectSchema } from './RecordSelect.schema';
import { RecordIncludeObjectSchema as RecordIncludeObjectSchema } from './RecordInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => RecordSelectObjectSchema).optional(),
  include: z.lazy(() => RecordIncludeObjectSchema).optional()
}).strict();
export const RecordArgsObjectSchema = makeSchema();
export const RecordArgsObjectZodSchema = makeSchema();
