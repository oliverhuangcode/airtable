import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { RecordWhereInputObjectSchema as RecordWhereInputObjectSchema } from './objects/RecordWhereInput.schema';

export const RecordDeleteManySchema: z.ZodType<Prisma.RecordDeleteManyArgs> = z.object({ where: RecordWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.RecordDeleteManyArgs>;

export const RecordDeleteManyZodSchema = z.object({ where: RecordWhereInputObjectSchema.optional() }).strict();