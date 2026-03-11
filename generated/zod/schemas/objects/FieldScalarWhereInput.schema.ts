import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumFieldTypeFilterObjectSchema as EnumFieldTypeFilterObjectSchema } from './EnumFieldTypeFilter.schema';
import { FieldTypeSchema } from '../enums/FieldType.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const fieldscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => FieldScalarWhereInputObjectSchema), z.lazy(() => FieldScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => FieldScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => FieldScalarWhereInputObjectSchema), z.lazy(() => FieldScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => EnumFieldTypeFilterObjectSchema), FieldTypeSchema]).optional(),
  tableId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  order: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const FieldScalarWhereInputObjectSchema: z.ZodType<Prisma.FieldScalarWhereInput> = fieldscalarwhereinputSchema as unknown as z.ZodType<Prisma.FieldScalarWhereInput>;
export const FieldScalarWhereInputObjectZodSchema = fieldscalarwhereinputSchema;
