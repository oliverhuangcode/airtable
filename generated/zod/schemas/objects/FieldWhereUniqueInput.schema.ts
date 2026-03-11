import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { FieldTableIdNameCompoundUniqueInputObjectSchema as FieldTableIdNameCompoundUniqueInputObjectSchema } from './FieldTableIdNameCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  tableId_name: z.lazy(() => FieldTableIdNameCompoundUniqueInputObjectSchema).optional()
}).strict();
export const FieldWhereUniqueInputObjectSchema: z.ZodType<Prisma.FieldWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.FieldWhereUniqueInput>;
export const FieldWhereUniqueInputObjectZodSchema = makeSchema();
