import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RecordUncheckedCreateNestedManyWithoutTableInputObjectSchema as RecordUncheckedCreateNestedManyWithoutTableInputObjectSchema } from './RecordUncheckedCreateNestedManyWithoutTableInput.schema';
import { ViewUncheckedCreateNestedManyWithoutTableInputObjectSchema as ViewUncheckedCreateNestedManyWithoutTableInputObjectSchema } from './ViewUncheckedCreateNestedManyWithoutTableInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  baseId: z.string(),
  order: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  records: z.lazy(() => RecordUncheckedCreateNestedManyWithoutTableInputObjectSchema).optional(),
  views: z.lazy(() => ViewUncheckedCreateNestedManyWithoutTableInputObjectSchema).optional()
}).strict();
export const TableUncheckedCreateWithoutFieldsInputObjectSchema: z.ZodType<Prisma.TableUncheckedCreateWithoutFieldsInput> = makeSchema() as unknown as z.ZodType<Prisma.TableUncheckedCreateWithoutFieldsInput>;
export const TableUncheckedCreateWithoutFieldsInputObjectZodSchema = makeSchema();
