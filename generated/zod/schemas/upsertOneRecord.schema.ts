import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { RecordSelectObjectSchema as RecordSelectObjectSchema } from './objects/RecordSelect.schema';
import { RecordIncludeObjectSchema as RecordIncludeObjectSchema } from './objects/RecordInclude.schema';
import { RecordWhereUniqueInputObjectSchema as RecordWhereUniqueInputObjectSchema } from './objects/RecordWhereUniqueInput.schema';
import { RecordCreateInputObjectSchema as RecordCreateInputObjectSchema } from './objects/RecordCreateInput.schema';
import { RecordUncheckedCreateInputObjectSchema as RecordUncheckedCreateInputObjectSchema } from './objects/RecordUncheckedCreateInput.schema';
import { RecordUpdateInputObjectSchema as RecordUpdateInputObjectSchema } from './objects/RecordUpdateInput.schema';
import { RecordUncheckedUpdateInputObjectSchema as RecordUncheckedUpdateInputObjectSchema } from './objects/RecordUncheckedUpdateInput.schema';

export const RecordUpsertOneSchema: z.ZodType<Prisma.RecordUpsertArgs> = z.object({ select: RecordSelectObjectSchema.optional(), include: RecordIncludeObjectSchema.optional(), where: RecordWhereUniqueInputObjectSchema, create: z.union([ RecordCreateInputObjectSchema, RecordUncheckedCreateInputObjectSchema ]), update: z.union([ RecordUpdateInputObjectSchema, RecordUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.RecordUpsertArgs>;

export const RecordUpsertOneZodSchema = z.object({ select: RecordSelectObjectSchema.optional(), include: RecordIncludeObjectSchema.optional(), where: RecordWhereUniqueInputObjectSchema, create: z.union([ RecordCreateInputObjectSchema, RecordUncheckedCreateInputObjectSchema ]), update: z.union([ RecordUpdateInputObjectSchema, RecordUncheckedUpdateInputObjectSchema ]) }).strict();