import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RecordWhereInputObjectSchema as RecordWhereInputObjectSchema } from './RecordWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => RecordWhereInputObjectSchema).optional(),
  some: z.lazy(() => RecordWhereInputObjectSchema).optional(),
  none: z.lazy(() => RecordWhereInputObjectSchema).optional()
}).strict();
export const RecordListRelationFilterObjectSchema: z.ZodType<Prisma.RecordListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.RecordListRelationFilter>;
export const RecordListRelationFilterObjectZodSchema = makeSchema();
