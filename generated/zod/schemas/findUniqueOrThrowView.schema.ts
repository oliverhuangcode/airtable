import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ViewSelectObjectSchema as ViewSelectObjectSchema } from './objects/ViewSelect.schema';
import { ViewIncludeObjectSchema as ViewIncludeObjectSchema } from './objects/ViewInclude.schema';
import { ViewWhereUniqueInputObjectSchema as ViewWhereUniqueInputObjectSchema } from './objects/ViewWhereUniqueInput.schema';

export const ViewFindUniqueOrThrowSchema: z.ZodType<Prisma.ViewFindUniqueOrThrowArgs> = z.object({ select: ViewSelectObjectSchema.optional(), include: ViewIncludeObjectSchema.optional(), where: ViewWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ViewFindUniqueOrThrowArgs>;

export const ViewFindUniqueOrThrowZodSchema = z.object({ select: ViewSelectObjectSchema.optional(), include: ViewIncludeObjectSchema.optional(), where: ViewWhereUniqueInputObjectSchema }).strict();