import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { RecordCreateManyInputObjectSchema as RecordCreateManyInputObjectSchema } from './objects/RecordCreateManyInput.schema';

export const RecordCreateManySchema: z.ZodType<Prisma.RecordCreateManyArgs> = z.object({ data: z.union([ RecordCreateManyInputObjectSchema, z.array(RecordCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.RecordCreateManyArgs>;

export const RecordCreateManyZodSchema = z.object({ data: z.union([ RecordCreateManyInputObjectSchema, z.array(RecordCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();