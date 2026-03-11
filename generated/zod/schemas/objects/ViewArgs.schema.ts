import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ViewSelectObjectSchema as ViewSelectObjectSchema } from './ViewSelect.schema';
import { ViewIncludeObjectSchema as ViewIncludeObjectSchema } from './ViewInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ViewSelectObjectSchema).optional(),
  include: z.lazy(() => ViewIncludeObjectSchema).optional()
}).strict();
export const ViewArgsObjectSchema = makeSchema();
export const ViewArgsObjectZodSchema = makeSchema();
