import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ViewIncludeObjectSchema as ViewIncludeObjectSchema } from './objects/ViewInclude.schema';
import { ViewOrderByWithRelationInputObjectSchema as ViewOrderByWithRelationInputObjectSchema } from './objects/ViewOrderByWithRelationInput.schema';
import { ViewWhereInputObjectSchema as ViewWhereInputObjectSchema } from './objects/ViewWhereInput.schema';
import { ViewWhereUniqueInputObjectSchema as ViewWhereUniqueInputObjectSchema } from './objects/ViewWhereUniqueInput.schema';
import { ViewScalarFieldEnumSchema } from './enums/ViewScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ViewFindFirstSelectSchema: z.ZodType<Prisma.ViewSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    tableId: z.boolean().optional(),
    table: z.boolean().optional(),
    filters: z.boolean().optional(),
    sorts: z.boolean().optional(),
    hiddenFields: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ViewSelect>;

export const ViewFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    tableId: z.boolean().optional(),
    table: z.boolean().optional(),
    filters: z.boolean().optional(),
    sorts: z.boolean().optional(),
    hiddenFields: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const ViewFindFirstSchema: z.ZodType<Prisma.ViewFindFirstArgs> = z.object({ select: ViewFindFirstSelectSchema.optional(), include: z.lazy(() => ViewIncludeObjectSchema.optional()), orderBy: z.union([ViewOrderByWithRelationInputObjectSchema, ViewOrderByWithRelationInputObjectSchema.array()]).optional(), where: ViewWhereInputObjectSchema.optional(), cursor: ViewWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ViewScalarFieldEnumSchema, ViewScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ViewFindFirstArgs>;

export const ViewFindFirstZodSchema = z.object({ select: ViewFindFirstSelectSchema.optional(), include: z.lazy(() => ViewIncludeObjectSchema.optional()), orderBy: z.union([ViewOrderByWithRelationInputObjectSchema, ViewOrderByWithRelationInputObjectSchema.array()]).optional(), where: ViewWhereInputObjectSchema.optional(), cursor: ViewWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ViewScalarFieldEnumSchema, ViewScalarFieldEnumSchema.array()]).optional() }).strict();