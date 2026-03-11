import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { FieldUncheckedUpdateManyWithoutTableNestedInputObjectSchema as FieldUncheckedUpdateManyWithoutTableNestedInputObjectSchema } from './FieldUncheckedUpdateManyWithoutTableNestedInput.schema';
import { ViewUncheckedUpdateManyWithoutTableNestedInputObjectSchema as ViewUncheckedUpdateManyWithoutTableNestedInputObjectSchema } from './ViewUncheckedUpdateManyWithoutTableNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  baseId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  order: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  fields: z.lazy(() => FieldUncheckedUpdateManyWithoutTableNestedInputObjectSchema).optional(),
  views: z.lazy(() => ViewUncheckedUpdateManyWithoutTableNestedInputObjectSchema).optional()
}).strict();
export const TableUncheckedUpdateWithoutRecordsInputObjectSchema: z.ZodType<Prisma.TableUncheckedUpdateWithoutRecordsInput> = makeSchema() as unknown as z.ZodType<Prisma.TableUncheckedUpdateWithoutRecordsInput>;
export const TableUncheckedUpdateWithoutRecordsInputObjectZodSchema = makeSchema();
