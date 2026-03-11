import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { RecordIncludeObjectSchema as RecordIncludeObjectSchema } from './objects/RecordInclude.schema';
import { RecordOrderByWithRelationInputObjectSchema as RecordOrderByWithRelationInputObjectSchema } from './objects/RecordOrderByWithRelationInput.schema';
import { RecordWhereInputObjectSchema as RecordWhereInputObjectSchema } from './objects/RecordWhereInput.schema';
import { RecordWhereUniqueInputObjectSchema as RecordWhereUniqueInputObjectSchema } from './objects/RecordWhereUniqueInput.schema';
import { RecordScalarFieldEnumSchema } from './enums/RecordScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const RecordFindFirstSelectSchema: z.ZodType<Prisma.RecordSelect> = z.object({
    id: z.boolean().optional(),
    tableId: z.boolean().optional(),
    table: z.boolean().optional(),
    order: z.boolean().optional(),
    data: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.RecordSelect>;

export const RecordFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    tableId: z.boolean().optional(),
    table: z.boolean().optional(),
    order: z.boolean().optional(),
    data: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const RecordFindFirstSchema: z.ZodType<Prisma.RecordFindFirstArgs> = z.object({ select: RecordFindFirstSelectSchema.optional(), include: z.lazy(() => RecordIncludeObjectSchema.optional()), orderBy: z.union([RecordOrderByWithRelationInputObjectSchema, RecordOrderByWithRelationInputObjectSchema.array()]).optional(), where: RecordWhereInputObjectSchema.optional(), cursor: RecordWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([RecordScalarFieldEnumSchema, RecordScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.RecordFindFirstArgs>;

export const RecordFindFirstZodSchema = z.object({ select: RecordFindFirstSelectSchema.optional(), include: z.lazy(() => RecordIncludeObjectSchema.optional()), orderBy: z.union([RecordOrderByWithRelationInputObjectSchema, RecordOrderByWithRelationInputObjectSchema.array()]).optional(), where: RecordWhereInputObjectSchema.optional(), cursor: RecordWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([RecordScalarFieldEnumSchema, RecordScalarFieldEnumSchema.array()]).optional() }).strict();