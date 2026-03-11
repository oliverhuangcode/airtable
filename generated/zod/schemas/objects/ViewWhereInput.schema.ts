import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { JsonFilterObjectSchema as JsonFilterObjectSchema } from './JsonFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { TableScalarRelationFilterObjectSchema as TableScalarRelationFilterObjectSchema } from './TableScalarRelationFilter.schema';
import { TableWhereInputObjectSchema as TableWhereInputObjectSchema } from './TableWhereInput.schema'

const viewwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ViewWhereInputObjectSchema), z.lazy(() => ViewWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ViewWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ViewWhereInputObjectSchema), z.lazy(() => ViewWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  tableId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  filters: z.lazy(() => JsonFilterObjectSchema).optional(),
  sorts: z.lazy(() => JsonFilterObjectSchema).optional(),
  hiddenFields: z.lazy(() => JsonFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  table: z.union([z.lazy(() => TableScalarRelationFilterObjectSchema), z.lazy(() => TableWhereInputObjectSchema)]).optional()
}).strict();
export const ViewWhereInputObjectSchema: z.ZodType<Prisma.ViewWhereInput> = viewwhereinputSchema as unknown as z.ZodType<Prisma.ViewWhereInput>;
export const ViewWhereInputObjectZodSchema = viewwhereinputSchema;
