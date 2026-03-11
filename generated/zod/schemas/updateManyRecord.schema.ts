import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { RecordUpdateManyMutationInputObjectSchema as RecordUpdateManyMutationInputObjectSchema } from './objects/RecordUpdateManyMutationInput.schema';
import { RecordWhereInputObjectSchema as RecordWhereInputObjectSchema } from './objects/RecordWhereInput.schema';

export const RecordUpdateManySchema: z.ZodType<Prisma.RecordUpdateManyArgs> = z.object({ data: RecordUpdateManyMutationInputObjectSchema, where: RecordWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.RecordUpdateManyArgs>;

export const RecordUpdateManyZodSchema = z.object({ data: RecordUpdateManyMutationInputObjectSchema, where: RecordWhereInputObjectSchema.optional() }).strict();