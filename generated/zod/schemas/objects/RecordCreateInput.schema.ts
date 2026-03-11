import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { TableCreateNestedOneWithoutRecordsInputObjectSchema as TableCreateNestedOneWithoutRecordsInputObjectSchema } from './TableCreateNestedOneWithoutRecordsInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  order: z.number().int().optional(),
  data: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  table: z.lazy(() => TableCreateNestedOneWithoutRecordsInputObjectSchema)
}).strict();
export const RecordCreateInputObjectSchema: z.ZodType<Prisma.RecordCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.RecordCreateInput>;
export const RecordCreateInputObjectZodSchema = makeSchema();
