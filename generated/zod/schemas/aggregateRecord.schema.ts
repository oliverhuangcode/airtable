import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { RecordOrderByWithRelationInputObjectSchema as RecordOrderByWithRelationInputObjectSchema } from './objects/RecordOrderByWithRelationInput.schema';
import { RecordWhereInputObjectSchema as RecordWhereInputObjectSchema } from './objects/RecordWhereInput.schema';
import { RecordWhereUniqueInputObjectSchema as RecordWhereUniqueInputObjectSchema } from './objects/RecordWhereUniqueInput.schema';
import { RecordCountAggregateInputObjectSchema as RecordCountAggregateInputObjectSchema } from './objects/RecordCountAggregateInput.schema';
import { RecordMinAggregateInputObjectSchema as RecordMinAggregateInputObjectSchema } from './objects/RecordMinAggregateInput.schema';
import { RecordMaxAggregateInputObjectSchema as RecordMaxAggregateInputObjectSchema } from './objects/RecordMaxAggregateInput.schema';
import { RecordAvgAggregateInputObjectSchema as RecordAvgAggregateInputObjectSchema } from './objects/RecordAvgAggregateInput.schema';
import { RecordSumAggregateInputObjectSchema as RecordSumAggregateInputObjectSchema } from './objects/RecordSumAggregateInput.schema';

export const RecordAggregateSchema: z.ZodType<Prisma.RecordAggregateArgs> = z.object({ orderBy: z.union([RecordOrderByWithRelationInputObjectSchema, RecordOrderByWithRelationInputObjectSchema.array()]).optional(), where: RecordWhereInputObjectSchema.optional(), cursor: RecordWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), RecordCountAggregateInputObjectSchema ]).optional(), _min: RecordMinAggregateInputObjectSchema.optional(), _max: RecordMaxAggregateInputObjectSchema.optional(), _avg: RecordAvgAggregateInputObjectSchema.optional(), _sum: RecordSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.RecordAggregateArgs>;

export const RecordAggregateZodSchema = z.object({ orderBy: z.union([RecordOrderByWithRelationInputObjectSchema, RecordOrderByWithRelationInputObjectSchema.array()]).optional(), where: RecordWhereInputObjectSchema.optional(), cursor: RecordWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), RecordCountAggregateInputObjectSchema ]).optional(), _min: RecordMinAggregateInputObjectSchema.optional(), _max: RecordMaxAggregateInputObjectSchema.optional(), _avg: RecordAvgAggregateInputObjectSchema.optional(), _sum: RecordSumAggregateInputObjectSchema.optional() }).strict();