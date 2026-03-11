import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ViewWhereInputObjectSchema as ViewWhereInputObjectSchema } from './objects/ViewWhereInput.schema';
import { ViewOrderByWithAggregationInputObjectSchema as ViewOrderByWithAggregationInputObjectSchema } from './objects/ViewOrderByWithAggregationInput.schema';
import { ViewScalarWhereWithAggregatesInputObjectSchema as ViewScalarWhereWithAggregatesInputObjectSchema } from './objects/ViewScalarWhereWithAggregatesInput.schema';
import { ViewScalarFieldEnumSchema } from './enums/ViewScalarFieldEnum.schema';
import { ViewCountAggregateInputObjectSchema as ViewCountAggregateInputObjectSchema } from './objects/ViewCountAggregateInput.schema';
import { ViewMinAggregateInputObjectSchema as ViewMinAggregateInputObjectSchema } from './objects/ViewMinAggregateInput.schema';
import { ViewMaxAggregateInputObjectSchema as ViewMaxAggregateInputObjectSchema } from './objects/ViewMaxAggregateInput.schema';

export const ViewGroupBySchema: z.ZodType<Prisma.ViewGroupByArgs> = z.object({ where: ViewWhereInputObjectSchema.optional(), orderBy: z.union([ViewOrderByWithAggregationInputObjectSchema, ViewOrderByWithAggregationInputObjectSchema.array()]).optional(), having: ViewScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(ViewScalarFieldEnumSchema), _count: z.union([ z.literal(true), ViewCountAggregateInputObjectSchema ]).optional(), _min: ViewMinAggregateInputObjectSchema.optional(), _max: ViewMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ViewGroupByArgs>;

export const ViewGroupByZodSchema = z.object({ where: ViewWhereInputObjectSchema.optional(), orderBy: z.union([ViewOrderByWithAggregationInputObjectSchema, ViewOrderByWithAggregationInputObjectSchema.array()]).optional(), having: ViewScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(ViewScalarFieldEnumSchema), _count: z.union([ z.literal(true), ViewCountAggregateInputObjectSchema ]).optional(), _min: ViewMinAggregateInputObjectSchema.optional(), _max: ViewMaxAggregateInputObjectSchema.optional() }).strict();