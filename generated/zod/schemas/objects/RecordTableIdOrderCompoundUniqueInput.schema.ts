import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  tableId: z.string(),
  order: z.number().int()
}).strict();
export const RecordTableIdOrderCompoundUniqueInputObjectSchema: z.ZodType<Prisma.RecordTableIdOrderCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.RecordTableIdOrderCompoundUniqueInput>;
export const RecordTableIdOrderCompoundUniqueInputObjectZodSchema = makeSchema();
