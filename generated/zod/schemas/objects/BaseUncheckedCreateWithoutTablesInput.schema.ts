import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  createdById: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const BaseUncheckedCreateWithoutTablesInputObjectSchema: z.ZodType<Prisma.BaseUncheckedCreateWithoutTablesInput> = makeSchema() as unknown as z.ZodType<Prisma.BaseUncheckedCreateWithoutTablesInput>;
export const BaseUncheckedCreateWithoutTablesInputObjectZodSchema = makeSchema();
