import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { FieldSelectObjectSchema as FieldSelectObjectSchema } from './objects/FieldSelect.schema';
import { FieldIncludeObjectSchema as FieldIncludeObjectSchema } from './objects/FieldInclude.schema';
import { FieldUpdateInputObjectSchema as FieldUpdateInputObjectSchema } from './objects/FieldUpdateInput.schema';
import { FieldUncheckedUpdateInputObjectSchema as FieldUncheckedUpdateInputObjectSchema } from './objects/FieldUncheckedUpdateInput.schema';
import { FieldWhereUniqueInputObjectSchema as FieldWhereUniqueInputObjectSchema } from './objects/FieldWhereUniqueInput.schema';

export const FieldUpdateOneSchema: z.ZodType<Prisma.FieldUpdateArgs> = z.object({ select: FieldSelectObjectSchema.optional(), include: FieldIncludeObjectSchema.optional(), data: z.union([FieldUpdateInputObjectSchema, FieldUncheckedUpdateInputObjectSchema]), where: FieldWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.FieldUpdateArgs>;

export const FieldUpdateOneZodSchema = z.object({ select: FieldSelectObjectSchema.optional(), include: FieldIncludeObjectSchema.optional(), data: z.union([FieldUpdateInputObjectSchema, FieldUncheckedUpdateInputObjectSchema]), where: FieldWhereUniqueInputObjectSchema }).strict();