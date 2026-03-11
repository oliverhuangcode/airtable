import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  tableId: z.string(),
  name: z.string()
}).strict();
export const FieldTableIdNameCompoundUniqueInputObjectSchema: z.ZodType<Prisma.FieldTableIdNameCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.FieldTableIdNameCompoundUniqueInput>;
export const FieldTableIdNameCompoundUniqueInputObjectZodSchema = makeSchema();
