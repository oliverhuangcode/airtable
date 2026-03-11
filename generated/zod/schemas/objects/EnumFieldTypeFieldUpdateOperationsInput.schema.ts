import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { FieldTypeSchema } from '../enums/FieldType.schema'

const makeSchema = () => z.object({
  set: FieldTypeSchema.optional()
}).strict();
export const EnumFieldTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumFieldTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumFieldTypeFieldUpdateOperationsInput>;
export const EnumFieldTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
