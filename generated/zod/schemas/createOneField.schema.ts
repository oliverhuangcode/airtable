import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { FieldSelectObjectSchema as FieldSelectObjectSchema } from './objects/FieldSelect.schema';
import { FieldIncludeObjectSchema as FieldIncludeObjectSchema } from './objects/FieldInclude.schema';
import { FieldCreateInputObjectSchema as FieldCreateInputObjectSchema } from './objects/FieldCreateInput.schema';
import { FieldUncheckedCreateInputObjectSchema as FieldUncheckedCreateInputObjectSchema } from './objects/FieldUncheckedCreateInput.schema';

export const FieldCreateOneSchema: z.ZodType<Prisma.FieldCreateArgs> = z.object({ select: FieldSelectObjectSchema.optional(), include: FieldIncludeObjectSchema.optional(), data: z.union([FieldCreateInputObjectSchema, FieldUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.FieldCreateArgs>;

export const FieldCreateOneZodSchema = z.object({ select: FieldSelectObjectSchema.optional(), include: FieldIncludeObjectSchema.optional(), data: z.union([FieldCreateInputObjectSchema, FieldUncheckedCreateInputObjectSchema]) }).strict();