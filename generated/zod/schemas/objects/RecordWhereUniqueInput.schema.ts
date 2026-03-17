import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RecordTableIdOrderCompoundUniqueInputObjectSchema as RecordTableIdOrderCompoundUniqueInputObjectSchema } from './RecordTableIdOrderCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  tableId_order: z.lazy(() => RecordTableIdOrderCompoundUniqueInputObjectSchema).optional()
}).strict();
export const RecordWhereUniqueInputObjectSchema: z.ZodType<Prisma.RecordWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.RecordWhereUniqueInput>;
export const RecordWhereUniqueInputObjectZodSchema = makeSchema();
