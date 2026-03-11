import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { RecordSelectObjectSchema as RecordSelectObjectSchema } from './objects/RecordSelect.schema';
import { RecordCreateManyInputObjectSchema as RecordCreateManyInputObjectSchema } from './objects/RecordCreateManyInput.schema';

export const RecordCreateManyAndReturnSchema: z.ZodType<Prisma.RecordCreateManyAndReturnArgs> = z.object({ select: RecordSelectObjectSchema.optional(), data: z.union([ RecordCreateManyInputObjectSchema, z.array(RecordCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.RecordCreateManyAndReturnArgs>;

export const RecordCreateManyAndReturnZodSchema = z.object({ select: RecordSelectObjectSchema.optional(), data: z.union([ RecordCreateManyInputObjectSchema, z.array(RecordCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();