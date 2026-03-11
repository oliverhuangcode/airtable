import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { JsonWithAggregatesFilterObjectSchema as JsonWithAggregatesFilterObjectSchema } from './JsonWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const viewscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => ViewScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ViewScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ViewScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ViewScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ViewScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  tableId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  filters: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  sorts: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  hiddenFields: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const ViewScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.ViewScalarWhereWithAggregatesInput> = viewscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.ViewScalarWhereWithAggregatesInput>;
export const ViewScalarWhereWithAggregatesInputObjectZodSchema = viewscalarwherewithaggregatesinputSchema;
