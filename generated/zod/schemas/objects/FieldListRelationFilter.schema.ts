import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { FieldWhereInputObjectSchema as FieldWhereInputObjectSchema } from './FieldWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => FieldWhereInputObjectSchema).optional(),
  some: z.lazy(() => FieldWhereInputObjectSchema).optional(),
  none: z.lazy(() => FieldWhereInputObjectSchema).optional()
}).strict();
export const FieldListRelationFilterObjectSchema: z.ZodType<Prisma.FieldListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.FieldListRelationFilter>;
export const FieldListRelationFilterObjectZodSchema = makeSchema();
