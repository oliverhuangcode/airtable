import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { FieldSelectObjectSchema as FieldSelectObjectSchema } from './objects/FieldSelect.schema';
import { FieldIncludeObjectSchema as FieldIncludeObjectSchema } from './objects/FieldInclude.schema';
import { FieldWhereUniqueInputObjectSchema as FieldWhereUniqueInputObjectSchema } from './objects/FieldWhereUniqueInput.schema';
import { FieldCreateInputObjectSchema as FieldCreateInputObjectSchema } from './objects/FieldCreateInput.schema';
import { FieldUncheckedCreateInputObjectSchema as FieldUncheckedCreateInputObjectSchema } from './objects/FieldUncheckedCreateInput.schema';
import { FieldUpdateInputObjectSchema as FieldUpdateInputObjectSchema } from './objects/FieldUpdateInput.schema';
import { FieldUncheckedUpdateInputObjectSchema as FieldUncheckedUpdateInputObjectSchema } from './objects/FieldUncheckedUpdateInput.schema';

export const FieldUpsertOneSchema: z.ZodType<Prisma.FieldUpsertArgs> = z.object({ select: FieldSelectObjectSchema.optional(), include: FieldIncludeObjectSchema.optional(), where: FieldWhereUniqueInputObjectSchema, create: z.union([ FieldCreateInputObjectSchema, FieldUncheckedCreateInputObjectSchema ]), update: z.union([ FieldUpdateInputObjectSchema, FieldUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.FieldUpsertArgs>;

export const FieldUpsertOneZodSchema = z.object({ select: FieldSelectObjectSchema.optional(), include: FieldIncludeObjectSchema.optional(), where: FieldWhereUniqueInputObjectSchema, create: z.union([ FieldCreateInputObjectSchema, FieldUncheckedCreateInputObjectSchema ]), update: z.union([ FieldUpdateInputObjectSchema, FieldUncheckedUpdateInputObjectSchema ]) }).strict();