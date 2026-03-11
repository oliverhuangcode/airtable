import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { FieldUncheckedCreateNestedManyWithoutTableInputObjectSchema as FieldUncheckedCreateNestedManyWithoutTableInputObjectSchema } from './FieldUncheckedCreateNestedManyWithoutTableInput.schema';
import { RecordUncheckedCreateNestedManyWithoutTableInputObjectSchema as RecordUncheckedCreateNestedManyWithoutTableInputObjectSchema } from './RecordUncheckedCreateNestedManyWithoutTableInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  baseId: z.string(),
  order: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  fields: z.lazy(() => FieldUncheckedCreateNestedManyWithoutTableInputObjectSchema).optional(),
  records: z.lazy(() => RecordUncheckedCreateNestedManyWithoutTableInputObjectSchema).optional()
}).strict();
export const TableUncheckedCreateWithoutViewsInputObjectSchema: z.ZodType<Prisma.TableUncheckedCreateWithoutViewsInput> = makeSchema() as unknown as z.ZodType<Prisma.TableUncheckedCreateWithoutViewsInput>;
export const TableUncheckedCreateWithoutViewsInputObjectZodSchema = makeSchema();
