import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { RecordSelectObjectSchema as RecordSelectObjectSchema } from './objects/RecordSelect.schema';
import { RecordIncludeObjectSchema as RecordIncludeObjectSchema } from './objects/RecordInclude.schema';
import { RecordCreateInputObjectSchema as RecordCreateInputObjectSchema } from './objects/RecordCreateInput.schema';
import { RecordUncheckedCreateInputObjectSchema as RecordUncheckedCreateInputObjectSchema } from './objects/RecordUncheckedCreateInput.schema';

export const RecordCreateOneSchema: z.ZodType<Prisma.RecordCreateArgs> = z.object({ select: RecordSelectObjectSchema.optional(), include: RecordIncludeObjectSchema.optional(), data: z.union([RecordCreateInputObjectSchema, RecordUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.RecordCreateArgs>;

export const RecordCreateOneZodSchema = z.object({ select: RecordSelectObjectSchema.optional(), include: RecordIncludeObjectSchema.optional(), data: z.union([RecordCreateInputObjectSchema, RecordUncheckedCreateInputObjectSchema]) }).strict();