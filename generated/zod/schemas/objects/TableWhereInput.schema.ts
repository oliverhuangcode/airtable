import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { BaseScalarRelationFilterObjectSchema as BaseScalarRelationFilterObjectSchema } from './BaseScalarRelationFilter.schema';
import { BaseWhereInputObjectSchema as BaseWhereInputObjectSchema } from './BaseWhereInput.schema';
import { FieldListRelationFilterObjectSchema as FieldListRelationFilterObjectSchema } from './FieldListRelationFilter.schema';
import { RecordListRelationFilterObjectSchema as RecordListRelationFilterObjectSchema } from './RecordListRelationFilter.schema';
import { ViewListRelationFilterObjectSchema as ViewListRelationFilterObjectSchema } from './ViewListRelationFilter.schema'

const tablewhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TableWhereInputObjectSchema), z.lazy(() => TableWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TableWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TableWhereInputObjectSchema), z.lazy(() => TableWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  baseId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  order: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  base: z.union([z.lazy(() => BaseScalarRelationFilterObjectSchema), z.lazy(() => BaseWhereInputObjectSchema)]).optional(),
  fields: z.lazy(() => FieldListRelationFilterObjectSchema).optional(),
  records: z.lazy(() => RecordListRelationFilterObjectSchema).optional(),
  views: z.lazy(() => ViewListRelationFilterObjectSchema).optional()
}).strict();
export const TableWhereInputObjectSchema: z.ZodType<Prisma.TableWhereInput> = tablewhereinputSchema as unknown as z.ZodType<Prisma.TableWhereInput>;
export const TableWhereInputObjectZodSchema = tablewhereinputSchema;
