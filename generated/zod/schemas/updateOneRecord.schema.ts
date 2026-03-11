import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { RecordSelectObjectSchema as RecordSelectObjectSchema } from './objects/RecordSelect.schema';
import { RecordIncludeObjectSchema as RecordIncludeObjectSchema } from './objects/RecordInclude.schema';
import { RecordUpdateInputObjectSchema as RecordUpdateInputObjectSchema } from './objects/RecordUpdateInput.schema';
import { RecordUncheckedUpdateInputObjectSchema as RecordUncheckedUpdateInputObjectSchema } from './objects/RecordUncheckedUpdateInput.schema';
import { RecordWhereUniqueInputObjectSchema as RecordWhereUniqueInputObjectSchema } from './objects/RecordWhereUniqueInput.schema';

export const RecordUpdateOneSchema: z.ZodType<Prisma.RecordUpdateArgs> = z.object({ select: RecordSelectObjectSchema.optional(), include: RecordIncludeObjectSchema.optional(), data: z.union([RecordUpdateInputObjectSchema, RecordUncheckedUpdateInputObjectSchema]), where: RecordWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.RecordUpdateArgs>;

export const RecordUpdateOneZodSchema = z.object({ select: RecordSelectObjectSchema.optional(), include: RecordIncludeObjectSchema.optional(), data: z.union([RecordUpdateInputObjectSchema, RecordUncheckedUpdateInputObjectSchema]), where: RecordWhereUniqueInputObjectSchema }).strict();