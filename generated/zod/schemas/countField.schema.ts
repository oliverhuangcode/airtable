import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { FieldOrderByWithRelationInputObjectSchema as FieldOrderByWithRelationInputObjectSchema } from './objects/FieldOrderByWithRelationInput.schema';
import { FieldWhereInputObjectSchema as FieldWhereInputObjectSchema } from './objects/FieldWhereInput.schema';
import { FieldWhereUniqueInputObjectSchema as FieldWhereUniqueInputObjectSchema } from './objects/FieldWhereUniqueInput.schema';
import { FieldCountAggregateInputObjectSchema as FieldCountAggregateInputObjectSchema } from './objects/FieldCountAggregateInput.schema';

export const FieldCountSchema: z.ZodType<Prisma.FieldCountArgs> = z.object({ orderBy: z.union([FieldOrderByWithRelationInputObjectSchema, FieldOrderByWithRelationInputObjectSchema.array()]).optional(), where: FieldWhereInputObjectSchema.optional(), cursor: FieldWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), FieldCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.FieldCountArgs>;

export const FieldCountZodSchema = z.object({ orderBy: z.union([FieldOrderByWithRelationInputObjectSchema, FieldOrderByWithRelationInputObjectSchema.array()]).optional(), where: FieldWhereInputObjectSchema.optional(), cursor: FieldWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), FieldCountAggregateInputObjectSchema ]).optional() }).strict();