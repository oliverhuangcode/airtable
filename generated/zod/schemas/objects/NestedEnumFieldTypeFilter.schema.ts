import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { FieldTypeSchema } from '../enums/FieldType.schema'

const nestedenumfieldtypefilterSchema = z.object({
  equals: FieldTypeSchema.optional(),
  in: FieldTypeSchema.array().optional(),
  notIn: FieldTypeSchema.array().optional(),
  not: z.union([FieldTypeSchema, z.lazy(() => NestedEnumFieldTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumFieldTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumFieldTypeFilter> = nestedenumfieldtypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumFieldTypeFilter>;
export const NestedEnumFieldTypeFilterObjectZodSchema = nestedenumfieldtypefilterSchema;
