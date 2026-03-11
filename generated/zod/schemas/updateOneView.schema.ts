import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ViewSelectObjectSchema as ViewSelectObjectSchema } from './objects/ViewSelect.schema';
import { ViewIncludeObjectSchema as ViewIncludeObjectSchema } from './objects/ViewInclude.schema';
import { ViewUpdateInputObjectSchema as ViewUpdateInputObjectSchema } from './objects/ViewUpdateInput.schema';
import { ViewUncheckedUpdateInputObjectSchema as ViewUncheckedUpdateInputObjectSchema } from './objects/ViewUncheckedUpdateInput.schema';
import { ViewWhereUniqueInputObjectSchema as ViewWhereUniqueInputObjectSchema } from './objects/ViewWhereUniqueInput.schema';

export const ViewUpdateOneSchema: z.ZodType<Prisma.ViewUpdateArgs> = z.object({ select: ViewSelectObjectSchema.optional(), include: ViewIncludeObjectSchema.optional(), data: z.union([ViewUpdateInputObjectSchema, ViewUncheckedUpdateInputObjectSchema]), where: ViewWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ViewUpdateArgs>;

export const ViewUpdateOneZodSchema = z.object({ select: ViewSelectObjectSchema.optional(), include: ViewIncludeObjectSchema.optional(), data: z.union([ViewUpdateInputObjectSchema, ViewUncheckedUpdateInputObjectSchema]), where: ViewWhereUniqueInputObjectSchema }).strict();