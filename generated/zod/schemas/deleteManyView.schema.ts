import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ViewWhereInputObjectSchema as ViewWhereInputObjectSchema } from './objects/ViewWhereInput.schema';

export const ViewDeleteManySchema: z.ZodType<Prisma.ViewDeleteManyArgs> = z.object({ where: ViewWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ViewDeleteManyArgs>;

export const ViewDeleteManyZodSchema = z.object({ where: ViewWhereInputObjectSchema.optional() }).strict();