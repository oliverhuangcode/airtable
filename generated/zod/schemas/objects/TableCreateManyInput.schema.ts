import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  baseId: z.string(),
  order: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const TableCreateManyInputObjectSchema: z.ZodType<Prisma.TableCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.TableCreateManyInput>;
export const TableCreateManyInputObjectZodSchema = makeSchema();
