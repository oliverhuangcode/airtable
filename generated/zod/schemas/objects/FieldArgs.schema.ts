import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { FieldSelectObjectSchema as FieldSelectObjectSchema } from './FieldSelect.schema';
import { FieldIncludeObjectSchema as FieldIncludeObjectSchema } from './FieldInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => FieldSelectObjectSchema).optional(),
  include: z.lazy(() => FieldIncludeObjectSchema).optional()
}).strict();
export const FieldArgsObjectSchema = makeSchema();
export const FieldArgsObjectZodSchema = makeSchema();
