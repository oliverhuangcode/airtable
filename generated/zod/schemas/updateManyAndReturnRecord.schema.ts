import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { RecordSelectObjectSchema as RecordSelectObjectSchema } from './objects/RecordSelect.schema';
import { RecordUpdateManyMutationInputObjectSchema as RecordUpdateManyMutationInputObjectSchema } from './objects/RecordUpdateManyMutationInput.schema';
import { RecordWhereInputObjectSchema as RecordWhereInputObjectSchema } from './objects/RecordWhereInput.schema';

export const RecordUpdateManyAndReturnSchema: z.ZodType<Prisma.RecordUpdateManyAndReturnArgs> = z.object({ select: RecordSelectObjectSchema.optional(), data: RecordUpdateManyMutationInputObjectSchema, where: RecordWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.RecordUpdateManyAndReturnArgs>;

export const RecordUpdateManyAndReturnZodSchema = z.object({ select: RecordSelectObjectSchema.optional(), data: RecordUpdateManyMutationInputObjectSchema, where: RecordWhereInputObjectSchema.optional() }).strict();