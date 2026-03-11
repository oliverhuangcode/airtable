import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { FieldWhereInputObjectSchema as FieldWhereInputObjectSchema } from './objects/FieldWhereInput.schema';
import { FieldOrderByWithAggregationInputObjectSchema as FieldOrderByWithAggregationInputObjectSchema } from './objects/FieldOrderByWithAggregationInput.schema';
import { FieldScalarWhereWithAggregatesInputObjectSchema as FieldScalarWhereWithAggregatesInputObjectSchema } from './objects/FieldScalarWhereWithAggregatesInput.schema';
import { FieldScalarFieldEnumSchema } from './enums/FieldScalarFieldEnum.schema';
import { FieldCountAggregateInputObjectSchema as FieldCountAggregateInputObjectSchema } from './objects/FieldCountAggregateInput.schema';
import { FieldMinAggregateInputObjectSchema as FieldMinAggregateInputObjectSchema } from './objects/FieldMinAggregateInput.schema';
import { FieldMaxAggregateInputObjectSchema as FieldMaxAggregateInputObjectSchema } from './objects/FieldMaxAggregateInput.schema';
import { FieldAvgAggregateInputObjectSchema as FieldAvgAggregateInputObjectSchema } from './objects/FieldAvgAggregateInput.schema';
import { FieldSumAggregateInputObjectSchema as FieldSumAggregateInputObjectSchema } from './objects/FieldSumAggregateInput.schema';

export const FieldGroupBySchema: z.ZodType<Prisma.FieldGroupByArgs> = z.object({ where: FieldWhereInputObjectSchema.optional(), orderBy: z.union([FieldOrderByWithAggregationInputObjectSchema, FieldOrderByWithAggregationInputObjectSchema.array()]).optional(), having: FieldScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(FieldScalarFieldEnumSchema), _count: z.union([ z.literal(true), FieldCountAggregateInputObjectSchema ]).optional(), _min: FieldMinAggregateInputObjectSchema.optional(), _max: FieldMaxAggregateInputObjectSchema.optional(), _avg: FieldAvgAggregateInputObjectSchema.optional(), _sum: FieldSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.FieldGroupByArgs>;

export const FieldGroupByZodSchema = z.object({ where: FieldWhereInputObjectSchema.optional(), orderBy: z.union([FieldOrderByWithAggregationInputObjectSchema, FieldOrderByWithAggregationInputObjectSchema.array()]).optional(), having: FieldScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(FieldScalarFieldEnumSchema), _count: z.union([ z.literal(true), FieldCountAggregateInputObjectSchema ]).optional(), _min: FieldMinAggregateInputObjectSchema.optional(), _max: FieldMaxAggregateInputObjectSchema.optional(), _avg: FieldAvgAggregateInputObjectSchema.optional(), _sum: FieldSumAggregateInputObjectSchema.optional() }).strict();