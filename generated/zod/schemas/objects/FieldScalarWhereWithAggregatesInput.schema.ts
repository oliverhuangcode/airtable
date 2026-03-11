import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumFieldTypeWithAggregatesFilterObjectSchema as EnumFieldTypeWithAggregatesFilterObjectSchema } from './EnumFieldTypeWithAggregatesFilter.schema';
import { FieldTypeSchema } from '../enums/FieldType.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const fieldscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => FieldScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => FieldScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => FieldScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => FieldScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => FieldScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => EnumFieldTypeWithAggregatesFilterObjectSchema), FieldTypeSchema]).optional(),
  tableId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  order: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const FieldScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.FieldScalarWhereWithAggregatesInput> = fieldscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.FieldScalarWhereWithAggregatesInput>;
export const FieldScalarWhereWithAggregatesInputObjectZodSchema = fieldscalarwherewithaggregatesinputSchema;
