import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { FieldOrderByWithRelationInputObjectSchema as FieldOrderByWithRelationInputObjectSchema } from './objects/FieldOrderByWithRelationInput.schema';
import { FieldWhereInputObjectSchema as FieldWhereInputObjectSchema } from './objects/FieldWhereInput.schema';
import { FieldWhereUniqueInputObjectSchema as FieldWhereUniqueInputObjectSchema } from './objects/FieldWhereUniqueInput.schema';
import { FieldCountAggregateInputObjectSchema as FieldCountAggregateInputObjectSchema } from './objects/FieldCountAggregateInput.schema';
import { FieldMinAggregateInputObjectSchema as FieldMinAggregateInputObjectSchema } from './objects/FieldMinAggregateInput.schema';
import { FieldMaxAggregateInputObjectSchema as FieldMaxAggregateInputObjectSchema } from './objects/FieldMaxAggregateInput.schema';
import { FieldAvgAggregateInputObjectSchema as FieldAvgAggregateInputObjectSchema } from './objects/FieldAvgAggregateInput.schema';
import { FieldSumAggregateInputObjectSchema as FieldSumAggregateInputObjectSchema } from './objects/FieldSumAggregateInput.schema';

export const FieldAggregateSchema: z.ZodType<Prisma.FieldAggregateArgs> = z.object({ orderBy: z.union([FieldOrderByWithRelationInputObjectSchema, FieldOrderByWithRelationInputObjectSchema.array()]).optional(), where: FieldWhereInputObjectSchema.optional(), cursor: FieldWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), FieldCountAggregateInputObjectSchema ]).optional(), _min: FieldMinAggregateInputObjectSchema.optional(), _max: FieldMaxAggregateInputObjectSchema.optional(), _avg: FieldAvgAggregateInputObjectSchema.optional(), _sum: FieldSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.FieldAggregateArgs>;

export const FieldAggregateZodSchema = z.object({ orderBy: z.union([FieldOrderByWithRelationInputObjectSchema, FieldOrderByWithRelationInputObjectSchema.array()]).optional(), where: FieldWhereInputObjectSchema.optional(), cursor: FieldWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), FieldCountAggregateInputObjectSchema ]).optional(), _min: FieldMinAggregateInputObjectSchema.optional(), _max: FieldMaxAggregateInputObjectSchema.optional(), _avg: FieldAvgAggregateInputObjectSchema.optional(), _sum: FieldSumAggregateInputObjectSchema.optional() }).strict();