import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { RecordOrderByWithRelationInputObjectSchema as RecordOrderByWithRelationInputObjectSchema } from './objects/RecordOrderByWithRelationInput.schema';
import { RecordWhereInputObjectSchema as RecordWhereInputObjectSchema } from './objects/RecordWhereInput.schema';
import { RecordWhereUniqueInputObjectSchema as RecordWhereUniqueInputObjectSchema } from './objects/RecordWhereUniqueInput.schema';
import { RecordCountAggregateInputObjectSchema as RecordCountAggregateInputObjectSchema } from './objects/RecordCountAggregateInput.schema';

export const RecordCountSchema: z.ZodType<Prisma.RecordCountArgs> = z.object({ orderBy: z.union([RecordOrderByWithRelationInputObjectSchema, RecordOrderByWithRelationInputObjectSchema.array()]).optional(), where: RecordWhereInputObjectSchema.optional(), cursor: RecordWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), RecordCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.RecordCountArgs>;

export const RecordCountZodSchema = z.object({ orderBy: z.union([RecordOrderByWithRelationInputObjectSchema, RecordOrderByWithRelationInputObjectSchema.array()]).optional(), where: RecordWhereInputObjectSchema.optional(), cursor: RecordWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), RecordCountAggregateInputObjectSchema ]).optional() }).strict();