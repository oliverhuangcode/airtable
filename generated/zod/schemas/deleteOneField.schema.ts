import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { FieldSelectObjectSchema as FieldSelectObjectSchema } from './objects/FieldSelect.schema';
import { FieldIncludeObjectSchema as FieldIncludeObjectSchema } from './objects/FieldInclude.schema';
import { FieldWhereUniqueInputObjectSchema as FieldWhereUniqueInputObjectSchema } from './objects/FieldWhereUniqueInput.schema';

export const FieldDeleteOneSchema: z.ZodType<Prisma.FieldDeleteArgs> = z.object({ select: FieldSelectObjectSchema.optional(), include: FieldIncludeObjectSchema.optional(), where: FieldWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.FieldDeleteArgs>;

export const FieldDeleteOneZodSchema = z.object({ select: FieldSelectObjectSchema.optional(), include: FieldIncludeObjectSchema.optional(), where: FieldWhereUniqueInputObjectSchema }).strict();