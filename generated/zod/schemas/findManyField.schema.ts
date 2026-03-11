import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { FieldIncludeObjectSchema as FieldIncludeObjectSchema } from './objects/FieldInclude.schema';
import { FieldOrderByWithRelationInputObjectSchema as FieldOrderByWithRelationInputObjectSchema } from './objects/FieldOrderByWithRelationInput.schema';
import { FieldWhereInputObjectSchema as FieldWhereInputObjectSchema } from './objects/FieldWhereInput.schema';
import { FieldWhereUniqueInputObjectSchema as FieldWhereUniqueInputObjectSchema } from './objects/FieldWhereUniqueInput.schema';
import { FieldScalarFieldEnumSchema } from './enums/FieldScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const FieldFindManySelectSchema: z.ZodType<Prisma.FieldSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    type: z.boolean().optional(),
    tableId: z.boolean().optional(),
    table: z.boolean().optional(),
    order: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.FieldSelect>;

export const FieldFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    type: z.boolean().optional(),
    tableId: z.boolean().optional(),
    table: z.boolean().optional(),
    order: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const FieldFindManySchema: z.ZodType<Prisma.FieldFindManyArgs> = z.object({ select: FieldFindManySelectSchema.optional(), include: z.lazy(() => FieldIncludeObjectSchema.optional()), orderBy: z.union([FieldOrderByWithRelationInputObjectSchema, FieldOrderByWithRelationInputObjectSchema.array()]).optional(), where: FieldWhereInputObjectSchema.optional(), cursor: FieldWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([FieldScalarFieldEnumSchema, FieldScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.FieldFindManyArgs>;

export const FieldFindManyZodSchema = z.object({ select: FieldFindManySelectSchema.optional(), include: z.lazy(() => FieldIncludeObjectSchema.optional()), orderBy: z.union([FieldOrderByWithRelationInputObjectSchema, FieldOrderByWithRelationInputObjectSchema.array()]).optional(), where: FieldWhereInputObjectSchema.optional(), cursor: FieldWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([FieldScalarFieldEnumSchema, FieldScalarFieldEnumSchema.array()]).optional() }).strict();