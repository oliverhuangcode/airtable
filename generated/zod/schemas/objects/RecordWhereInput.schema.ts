import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { JsonFilterObjectSchema as JsonFilterObjectSchema } from './JsonFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { TableScalarRelationFilterObjectSchema as TableScalarRelationFilterObjectSchema } from './TableScalarRelationFilter.schema';
import { TableWhereInputObjectSchema as TableWhereInputObjectSchema } from './TableWhereInput.schema'

const recordwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => RecordWhereInputObjectSchema), z.lazy(() => RecordWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RecordWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RecordWhereInputObjectSchema), z.lazy(() => RecordWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  tableId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  order: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  data: z.lazy(() => JsonFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  table: z.union([z.lazy(() => TableScalarRelationFilterObjectSchema), z.lazy(() => TableWhereInputObjectSchema)]).optional()
}).strict();
export const RecordWhereInputObjectSchema: z.ZodType<Prisma.RecordWhereInput> = recordwhereinputSchema as unknown as z.ZodType<Prisma.RecordWhereInput>;
export const RecordWhereInputObjectZodSchema = recordwhereinputSchema;
