import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { FieldCreateManyInputObjectSchema as FieldCreateManyInputObjectSchema } from './objects/FieldCreateManyInput.schema';

export const FieldCreateManySchema: z.ZodType<Prisma.FieldCreateManyArgs> = z.object({ data: z.union([ FieldCreateManyInputObjectSchema, z.array(FieldCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.FieldCreateManyArgs>;

export const FieldCreateManyZodSchema = z.object({ data: z.union([ FieldCreateManyInputObjectSchema, z.array(FieldCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();