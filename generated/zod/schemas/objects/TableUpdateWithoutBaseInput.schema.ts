import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { FieldUpdateManyWithoutTableNestedInputObjectSchema as FieldUpdateManyWithoutTableNestedInputObjectSchema } from './FieldUpdateManyWithoutTableNestedInput.schema';
import { RecordUpdateManyWithoutTableNestedInputObjectSchema as RecordUpdateManyWithoutTableNestedInputObjectSchema } from './RecordUpdateManyWithoutTableNestedInput.schema';
import { ViewUpdateManyWithoutTableNestedInputObjectSchema as ViewUpdateManyWithoutTableNestedInputObjectSchema } from './ViewUpdateManyWithoutTableNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  order: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  fields: z.lazy(() => FieldUpdateManyWithoutTableNestedInputObjectSchema).optional(),
  records: z.lazy(() => RecordUpdateManyWithoutTableNestedInputObjectSchema).optional(),
  views: z.lazy(() => ViewUpdateManyWithoutTableNestedInputObjectSchema).optional()
}).strict();
export const TableUpdateWithoutBaseInputObjectSchema: z.ZodType<Prisma.TableUpdateWithoutBaseInput> = makeSchema() as unknown as z.ZodType<Prisma.TableUpdateWithoutBaseInput>;
export const TableUpdateWithoutBaseInputObjectZodSchema = makeSchema();
