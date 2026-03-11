import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { FieldSelectObjectSchema as FieldSelectObjectSchema } from './objects/FieldSelect.schema';
import { FieldCreateManyInputObjectSchema as FieldCreateManyInputObjectSchema } from './objects/FieldCreateManyInput.schema';

export const FieldCreateManyAndReturnSchema: z.ZodType<Prisma.FieldCreateManyAndReturnArgs> = z.object({ select: FieldSelectObjectSchema.optional(), data: z.union([ FieldCreateManyInputObjectSchema, z.array(FieldCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.FieldCreateManyAndReturnArgs>;

export const FieldCreateManyAndReturnZodSchema = z.object({ select: FieldSelectObjectSchema.optional(), data: z.union([ FieldCreateManyInputObjectSchema, z.array(FieldCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();