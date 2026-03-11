import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ViewUpdateManyMutationInputObjectSchema as ViewUpdateManyMutationInputObjectSchema } from './objects/ViewUpdateManyMutationInput.schema';
import { ViewWhereInputObjectSchema as ViewWhereInputObjectSchema } from './objects/ViewWhereInput.schema';

export const ViewUpdateManySchema: z.ZodType<Prisma.ViewUpdateManyArgs> = z.object({ data: ViewUpdateManyMutationInputObjectSchema, where: ViewWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ViewUpdateManyArgs>;

export const ViewUpdateManyZodSchema = z.object({ data: ViewUpdateManyMutationInputObjectSchema, where: ViewWhereInputObjectSchema.optional() }).strict();