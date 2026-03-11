import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const RecordWhereUniqueInputObjectSchema: z.ZodType<Prisma.RecordWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.RecordWhereUniqueInput>;
export const RecordWhereUniqueInputObjectZodSchema = makeSchema();
