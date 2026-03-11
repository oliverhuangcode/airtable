import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { FieldTypeSchema } from '../enums/FieldType.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  type: FieldTypeSchema.optional(),
  tableId: z.string(),
  order: z.number().int().optional(),
  createdAt: z.coerce.date().optional()
}).strict();
export const FieldUncheckedCreateInputObjectSchema: z.ZodType<Prisma.FieldUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.FieldUncheckedCreateInput>;
export const FieldUncheckedCreateInputObjectZodSchema = makeSchema();
