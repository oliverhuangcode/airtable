import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { FieldUncheckedCreateNestedManyWithoutTableInputObjectSchema as FieldUncheckedCreateNestedManyWithoutTableInputObjectSchema } from './FieldUncheckedCreateNestedManyWithoutTableInput.schema';
import { ViewUncheckedCreateNestedManyWithoutTableInputObjectSchema as ViewUncheckedCreateNestedManyWithoutTableInputObjectSchema } from './ViewUncheckedCreateNestedManyWithoutTableInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  baseId: z.string(),
  order: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  fields: z.lazy(() => FieldUncheckedCreateNestedManyWithoutTableInputObjectSchema).optional(),
  views: z.lazy(() => ViewUncheckedCreateNestedManyWithoutTableInputObjectSchema).optional()
}).strict();
export const TableUncheckedCreateWithoutRecordsInputObjectSchema: z.ZodType<Prisma.TableUncheckedCreateWithoutRecordsInput> = makeSchema() as unknown as z.ZodType<Prisma.TableUncheckedCreateWithoutRecordsInput>;
export const TableUncheckedCreateWithoutRecordsInputObjectZodSchema = makeSchema();
