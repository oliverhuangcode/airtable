import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ViewSelectObjectSchema as ViewSelectObjectSchema } from './objects/ViewSelect.schema';
import { ViewIncludeObjectSchema as ViewIncludeObjectSchema } from './objects/ViewInclude.schema';
import { ViewWhereUniqueInputObjectSchema as ViewWhereUniqueInputObjectSchema } from './objects/ViewWhereUniqueInput.schema';
import { ViewCreateInputObjectSchema as ViewCreateInputObjectSchema } from './objects/ViewCreateInput.schema';
import { ViewUncheckedCreateInputObjectSchema as ViewUncheckedCreateInputObjectSchema } from './objects/ViewUncheckedCreateInput.schema';
import { ViewUpdateInputObjectSchema as ViewUpdateInputObjectSchema } from './objects/ViewUpdateInput.schema';
import { ViewUncheckedUpdateInputObjectSchema as ViewUncheckedUpdateInputObjectSchema } from './objects/ViewUncheckedUpdateInput.schema';

export const ViewUpsertOneSchema: z.ZodType<Prisma.ViewUpsertArgs> = z.object({ select: ViewSelectObjectSchema.optional(), include: ViewIncludeObjectSchema.optional(), where: ViewWhereUniqueInputObjectSchema, create: z.union([ ViewCreateInputObjectSchema, ViewUncheckedCreateInputObjectSchema ]), update: z.union([ ViewUpdateInputObjectSchema, ViewUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.ViewUpsertArgs>;

export const ViewUpsertOneZodSchema = z.object({ select: ViewSelectObjectSchema.optional(), include: ViewIncludeObjectSchema.optional(), where: ViewWhereUniqueInputObjectSchema, create: z.union([ ViewCreateInputObjectSchema, ViewUncheckedCreateInputObjectSchema ]), update: z.union([ ViewUpdateInputObjectSchema, ViewUncheckedUpdateInputObjectSchema ]) }).strict();