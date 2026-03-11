import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumFieldTypeFilterObjectSchema as EnumFieldTypeFilterObjectSchema } from './EnumFieldTypeFilter.schema';
import { FieldTypeSchema } from '../enums/FieldType.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { TableScalarRelationFilterObjectSchema as TableScalarRelationFilterObjectSchema } from './TableScalarRelationFilter.schema';
import { TableWhereInputObjectSchema as TableWhereInputObjectSchema } from './TableWhereInput.schema'

const fieldwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => FieldWhereInputObjectSchema), z.lazy(() => FieldWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => FieldWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => FieldWhereInputObjectSchema), z.lazy(() => FieldWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => EnumFieldTypeFilterObjectSchema), FieldTypeSchema]).optional(),
  tableId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  order: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  table: z.union([z.lazy(() => TableScalarRelationFilterObjectSchema), z.lazy(() => TableWhereInputObjectSchema)]).optional()
}).strict();
export const FieldWhereInputObjectSchema: z.ZodType<Prisma.FieldWhereInput> = fieldwhereinputSchema as unknown as z.ZodType<Prisma.FieldWhereInput>;
export const FieldWhereInputObjectZodSchema = fieldwhereinputSchema;
