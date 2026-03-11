import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { FieldWhereInputObjectSchema as FieldWhereInputObjectSchema } from './objects/FieldWhereInput.schema';

export const FieldDeleteManySchema: z.ZodType<Prisma.FieldDeleteManyArgs> = z.object({ where: FieldWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.FieldDeleteManyArgs>;

export const FieldDeleteManyZodSchema = z.object({ where: FieldWhereInputObjectSchema.optional() }).strict();