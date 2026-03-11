import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableCreateNestedManyWithoutBaseInputObjectSchema as TableCreateNestedManyWithoutBaseInputObjectSchema } from './TableCreateNestedManyWithoutBaseInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tables: z.lazy(() => TableCreateNestedManyWithoutBaseInputObjectSchema).optional()
}).strict();
export const BaseCreateWithoutCreatedByInputObjectSchema: z.ZodType<Prisma.BaseCreateWithoutCreatedByInput> = makeSchema() as unknown as z.ZodType<Prisma.BaseCreateWithoutCreatedByInput>;
export const BaseCreateWithoutCreatedByInputObjectZodSchema = makeSchema();
