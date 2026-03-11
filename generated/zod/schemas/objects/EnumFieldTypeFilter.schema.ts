import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { FieldTypeSchema } from '../enums/FieldType.schema';
import { NestedEnumFieldTypeFilterObjectSchema as NestedEnumFieldTypeFilterObjectSchema } from './NestedEnumFieldTypeFilter.schema'

const makeSchema = () => z.object({
  equals: FieldTypeSchema.optional(),
  in: FieldTypeSchema.array().optional(),
  notIn: FieldTypeSchema.array().optional(),
  not: z.union([FieldTypeSchema, z.lazy(() => NestedEnumFieldTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumFieldTypeFilterObjectSchema: z.ZodType<Prisma.EnumFieldTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumFieldTypeFilter>;
export const EnumFieldTypeFilterObjectZodSchema = makeSchema();
