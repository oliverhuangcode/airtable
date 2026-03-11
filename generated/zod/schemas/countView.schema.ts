import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ViewOrderByWithRelationInputObjectSchema as ViewOrderByWithRelationInputObjectSchema } from './objects/ViewOrderByWithRelationInput.schema';
import { ViewWhereInputObjectSchema as ViewWhereInputObjectSchema } from './objects/ViewWhereInput.schema';
import { ViewWhereUniqueInputObjectSchema as ViewWhereUniqueInputObjectSchema } from './objects/ViewWhereUniqueInput.schema';
import { ViewCountAggregateInputObjectSchema as ViewCountAggregateInputObjectSchema } from './objects/ViewCountAggregateInput.schema';

export const ViewCountSchema: z.ZodType<Prisma.ViewCountArgs> = z.object({ orderBy: z.union([ViewOrderByWithRelationInputObjectSchema, ViewOrderByWithRelationInputObjectSchema.array()]).optional(), where: ViewWhereInputObjectSchema.optional(), cursor: ViewWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ViewCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.ViewCountArgs>;

export const ViewCountZodSchema = z.object({ orderBy: z.union([ViewOrderByWithRelationInputObjectSchema, ViewOrderByWithRelationInputObjectSchema.array()]).optional(), where: ViewWhereInputObjectSchema.optional(), cursor: ViewWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ViewCountAggregateInputObjectSchema ]).optional() }).strict();