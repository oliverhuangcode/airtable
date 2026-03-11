import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  tableId: z.string(),
  order: z.number().int().optional(),
  data: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const RecordCreateManyInputObjectSchema: z.ZodType<Prisma.RecordCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.RecordCreateManyInput>;
export const RecordCreateManyInputObjectZodSchema = makeSchema();
