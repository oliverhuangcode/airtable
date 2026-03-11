import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { JsonFilterObjectSchema as JsonFilterObjectSchema } from './JsonFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const recordscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => RecordScalarWhereInputObjectSchema), z.lazy(() => RecordScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RecordScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RecordScalarWhereInputObjectSchema), z.lazy(() => RecordScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  tableId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  order: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  data: z.lazy(() => JsonFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const RecordScalarWhereInputObjectSchema: z.ZodType<Prisma.RecordScalarWhereInput> = recordscalarwhereinputSchema as unknown as z.ZodType<Prisma.RecordScalarWhereInput>;
export const RecordScalarWhereInputObjectZodSchema = recordscalarwhereinputSchema;
