import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { TableCreateNestedOneWithoutViewsInputObjectSchema as TableCreateNestedOneWithoutViewsInputObjectSchema } from './TableCreateNestedOneWithoutViewsInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  filters: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  sorts: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  hiddenFields: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  table: z.lazy(() => TableCreateNestedOneWithoutViewsInputObjectSchema)
}).strict();
export const ViewCreateInputObjectSchema: z.ZodType<Prisma.ViewCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ViewCreateInput>;
export const ViewCreateInputObjectZodSchema = makeSchema();
