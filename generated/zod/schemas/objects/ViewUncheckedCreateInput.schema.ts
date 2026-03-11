import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  tableId: z.string(),
  filters: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  sorts: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  hiddenFields: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional()
}).strict();
export const ViewUncheckedCreateInputObjectSchema: z.ZodType<Prisma.ViewUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ViewUncheckedCreateInput>;
export const ViewUncheckedCreateInputObjectZodSchema = makeSchema();
