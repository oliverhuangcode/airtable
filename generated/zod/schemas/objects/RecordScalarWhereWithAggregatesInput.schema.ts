import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { JsonWithAggregatesFilterObjectSchema as JsonWithAggregatesFilterObjectSchema } from './JsonWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const recordscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => RecordScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => RecordScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RecordScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RecordScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => RecordScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  tableId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  order: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  data: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const RecordScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.RecordScalarWhereWithAggregatesInput> = recordscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.RecordScalarWhereWithAggregatesInput>;
export const RecordScalarWhereWithAggregatesInputObjectZodSchema = recordscalarwherewithaggregatesinputSchema;
