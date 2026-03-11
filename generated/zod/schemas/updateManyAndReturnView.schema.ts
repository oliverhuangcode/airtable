import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ViewSelectObjectSchema as ViewSelectObjectSchema } from './objects/ViewSelect.schema';
import { ViewUpdateManyMutationInputObjectSchema as ViewUpdateManyMutationInputObjectSchema } from './objects/ViewUpdateManyMutationInput.schema';
import { ViewWhereInputObjectSchema as ViewWhereInputObjectSchema } from './objects/ViewWhereInput.schema';

export const ViewUpdateManyAndReturnSchema: z.ZodType<Prisma.ViewUpdateManyAndReturnArgs> = z.object({ select: ViewSelectObjectSchema.optional(), data: ViewUpdateManyMutationInputObjectSchema, where: ViewWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ViewUpdateManyAndReturnArgs>;

export const ViewUpdateManyAndReturnZodSchema = z.object({ select: ViewSelectObjectSchema.optional(), data: ViewUpdateManyMutationInputObjectSchema, where: ViewWhereInputObjectSchema.optional() }).strict();