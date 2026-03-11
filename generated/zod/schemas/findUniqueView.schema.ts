import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ViewSelectObjectSchema as ViewSelectObjectSchema } from './objects/ViewSelect.schema';
import { ViewIncludeObjectSchema as ViewIncludeObjectSchema } from './objects/ViewInclude.schema';
import { ViewWhereUniqueInputObjectSchema as ViewWhereUniqueInputObjectSchema } from './objects/ViewWhereUniqueInput.schema';

export const ViewFindUniqueSchema: z.ZodType<Prisma.ViewFindUniqueArgs> = z.object({ select: ViewSelectObjectSchema.optional(), include: ViewIncludeObjectSchema.optional(), where: ViewWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ViewFindUniqueArgs>;

export const ViewFindUniqueZodSchema = z.object({ select: ViewSelectObjectSchema.optional(), include: ViewIncludeObjectSchema.optional(), where: ViewWhereUniqueInputObjectSchema }).strict();