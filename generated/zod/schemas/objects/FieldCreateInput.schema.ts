import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { FieldTypeSchema } from '../enums/FieldType.schema';
import { TableCreateNestedOneWithoutFieldsInputObjectSchema as TableCreateNestedOneWithoutFieldsInputObjectSchema } from './TableCreateNestedOneWithoutFieldsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  type: FieldTypeSchema.optional(),
  order: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  table: z.lazy(() => TableCreateNestedOneWithoutFieldsInputObjectSchema)
}).strict();
export const FieldCreateInputObjectSchema: z.ZodType<Prisma.FieldCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.FieldCreateInput>;
export const FieldCreateInputObjectZodSchema = makeSchema();
