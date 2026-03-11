import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { FieldUncheckedCreateNestedManyWithoutTableInputObjectSchema as FieldUncheckedCreateNestedManyWithoutTableInputObjectSchema } from './FieldUncheckedCreateNestedManyWithoutTableInput.schema';
import { RecordUncheckedCreateNestedManyWithoutTableInputObjectSchema as RecordUncheckedCreateNestedManyWithoutTableInputObjectSchema } from './RecordUncheckedCreateNestedManyWithoutTableInput.schema';
import { ViewUncheckedCreateNestedManyWithoutTableInputObjectSchema as ViewUncheckedCreateNestedManyWithoutTableInputObjectSchema } from './ViewUncheckedCreateNestedManyWithoutTableInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  order: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  fields: z.lazy(() => FieldUncheckedCreateNestedManyWithoutTableInputObjectSchema).optional(),
  records: z.lazy(() => RecordUncheckedCreateNestedManyWithoutTableInputObjectSchema).optional(),
  views: z.lazy(() => ViewUncheckedCreateNestedManyWithoutTableInputObjectSchema).optional()
}).strict();
export const TableUncheckedCreateWithoutBaseInputObjectSchema: z.ZodType<Prisma.TableUncheckedCreateWithoutBaseInput> = makeSchema() as unknown as z.ZodType<Prisma.TableUncheckedCreateWithoutBaseInput>;
export const TableUncheckedCreateWithoutBaseInputObjectZodSchema = makeSchema();
