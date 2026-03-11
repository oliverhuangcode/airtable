import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const UserUncheckedCreateWithoutBasesInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutBasesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedCreateWithoutBasesInput>;
export const UserUncheckedCreateWithoutBasesInputObjectZodSchema = makeSchema();
