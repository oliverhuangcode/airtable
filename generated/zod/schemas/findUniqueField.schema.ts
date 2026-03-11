import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { FieldSelectObjectSchema as FieldSelectObjectSchema } from './objects/FieldSelect.schema';
import { FieldIncludeObjectSchema as FieldIncludeObjectSchema } from './objects/FieldInclude.schema';
import { FieldWhereUniqueInputObjectSchema as FieldWhereUniqueInputObjectSchema } from './objects/FieldWhereUniqueInput.schema';

export const FieldFindUniqueSchema: z.ZodType<Prisma.FieldFindUniqueArgs> = z.object({ select: FieldSelectObjectSchema.optional(), include: FieldIncludeObjectSchema.optional(), where: FieldWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.FieldFindUniqueArgs>;

export const FieldFindUniqueZodSchema = z.object({ select: FieldSelectObjectSchema.optional(), include: FieldIncludeObjectSchema.optional(), where: FieldWhereUniqueInputObjectSchema }).strict();