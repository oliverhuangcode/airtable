import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { FieldTypeSchema } from '../enums/FieldType.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumFieldTypeFilterObjectSchema as NestedEnumFieldTypeFilterObjectSchema } from './NestedEnumFieldTypeFilter.schema'

const nestedenumfieldtypewithaggregatesfilterSchema = z.object({
  equals: FieldTypeSchema.optional(),
  in: FieldTypeSchema.array().optional(),
  notIn: FieldTypeSchema.array().optional(),
  not: z.union([FieldTypeSchema, z.lazy(() => NestedEnumFieldTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumFieldTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumFieldTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumFieldTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumFieldTypeWithAggregatesFilter> = nestedenumfieldtypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumFieldTypeWithAggregatesFilter>;
export const NestedEnumFieldTypeWithAggregatesFilterObjectZodSchema = nestedenumfieldtypewithaggregatesfilterSchema;
