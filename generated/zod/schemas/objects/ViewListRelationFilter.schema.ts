import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ViewWhereInputObjectSchema as ViewWhereInputObjectSchema } from './ViewWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => ViewWhereInputObjectSchema).optional(),
  some: z.lazy(() => ViewWhereInputObjectSchema).optional(),
  none: z.lazy(() => ViewWhereInputObjectSchema).optional()
}).strict();
export const ViewListRelationFilterObjectSchema: z.ZodType<Prisma.ViewListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ViewListRelationFilter>;
export const ViewListRelationFilterObjectZodSchema = makeSchema();
