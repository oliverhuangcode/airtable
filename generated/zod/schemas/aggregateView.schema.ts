import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ViewOrderByWithRelationInputObjectSchema as ViewOrderByWithRelationInputObjectSchema } from './objects/ViewOrderByWithRelationInput.schema';
import { ViewWhereInputObjectSchema as ViewWhereInputObjectSchema } from './objects/ViewWhereInput.schema';
import { ViewWhereUniqueInputObjectSchema as ViewWhereUniqueInputObjectSchema } from './objects/ViewWhereUniqueInput.schema';
import { ViewCountAggregateInputObjectSchema as ViewCountAggregateInputObjectSchema } from './objects/ViewCountAggregateInput.schema';
import { ViewMinAggregateInputObjectSchema as ViewMinAggregateInputObjectSchema } from './objects/ViewMinAggregateInput.schema';
import { ViewMaxAggregateInputObjectSchema as ViewMaxAggregateInputObjectSchema } from './objects/ViewMaxAggregateInput.schema';

export const ViewAggregateSchema: z.ZodType<Prisma.ViewAggregateArgs> = z.object({ orderBy: z.union([ViewOrderByWithRelationInputObjectSchema, ViewOrderByWithRelationInputObjectSchema.array()]).optional(), where: ViewWhereInputObjectSchema.optional(), cursor: ViewWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), ViewCountAggregateInputObjectSchema ]).optional(), _min: ViewMinAggregateInputObjectSchema.optional(), _max: ViewMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ViewAggregateArgs>;

export const ViewAggregateZodSchema = z.object({ orderBy: z.union([ViewOrderByWithRelationInputObjectSchema, ViewOrderByWithRelationInputObjectSchema.array()]).optional(), where: ViewWhereInputObjectSchema.optional(), cursor: ViewWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), ViewCountAggregateInputObjectSchema ]).optional(), _min: ViewMinAggregateInputObjectSchema.optional(), _max: ViewMaxAggregateInputObjectSchema.optional() }).strict();