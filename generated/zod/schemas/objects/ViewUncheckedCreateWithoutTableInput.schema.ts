import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  filters: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  sorts: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  hiddenFields: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const ViewUncheckedCreateWithoutTableInputObjectSchema: z.ZodType<Prisma.ViewUncheckedCreateWithoutTableInput> = makeSchema() as unknown as z.ZodType<Prisma.ViewUncheckedCreateWithoutTableInput>;
export const ViewUncheckedCreateWithoutTableInputObjectZodSchema = makeSchema();
