import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ViewSelectObjectSchema as ViewSelectObjectSchema } from './objects/ViewSelect.schema';
import { ViewIncludeObjectSchema as ViewIncludeObjectSchema } from './objects/ViewInclude.schema';
import { ViewCreateInputObjectSchema as ViewCreateInputObjectSchema } from './objects/ViewCreateInput.schema';
import { ViewUncheckedCreateInputObjectSchema as ViewUncheckedCreateInputObjectSchema } from './objects/ViewUncheckedCreateInput.schema';

export const ViewCreateOneSchema: z.ZodType<Prisma.ViewCreateArgs> = z.object({ select: ViewSelectObjectSchema.optional(), include: ViewIncludeObjectSchema.optional(), data: z.union([ViewCreateInputObjectSchema, ViewUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ViewCreateArgs>;

export const ViewCreateOneZodSchema = z.object({ select: ViewSelectObjectSchema.optional(), include: ViewIncludeObjectSchema.optional(), data: z.union([ViewCreateInputObjectSchema, ViewUncheckedCreateInputObjectSchema]) }).strict();