import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { FieldTypeSchema } from '../enums/FieldType.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  type: FieldTypeSchema.optional(),
  order: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const FieldCreateWithoutTableInputObjectSchema: z.ZodType<Prisma.FieldCreateWithoutTableInput> = makeSchema() as unknown as z.ZodType<Prisma.FieldCreateWithoutTableInput>;
export const FieldCreateWithoutTableInputObjectZodSchema = makeSchema();
