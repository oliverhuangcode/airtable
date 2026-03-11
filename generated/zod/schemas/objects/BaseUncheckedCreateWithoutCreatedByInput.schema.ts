import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableUncheckedCreateNestedManyWithoutBaseInputObjectSchema as TableUncheckedCreateNestedManyWithoutBaseInputObjectSchema } from './TableUncheckedCreateNestedManyWithoutBaseInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tables: z.lazy(() => TableUncheckedCreateNestedManyWithoutBaseInputObjectSchema).optional()
}).strict();
export const BaseUncheckedCreateWithoutCreatedByInputObjectSchema: z.ZodType<Prisma.BaseUncheckedCreateWithoutCreatedByInput> = makeSchema() as unknown as z.ZodType<Prisma.BaseUncheckedCreateWithoutCreatedByInput>;
export const BaseUncheckedCreateWithoutCreatedByInputObjectZodSchema = makeSchema();
