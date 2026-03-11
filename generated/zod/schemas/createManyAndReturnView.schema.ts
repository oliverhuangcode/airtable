import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ViewSelectObjectSchema as ViewSelectObjectSchema } from './objects/ViewSelect.schema';
import { ViewCreateManyInputObjectSchema as ViewCreateManyInputObjectSchema } from './objects/ViewCreateManyInput.schema';

export const ViewCreateManyAndReturnSchema: z.ZodType<Prisma.ViewCreateManyAndReturnArgs> = z.object({ select: ViewSelectObjectSchema.optional(), data: z.union([ ViewCreateManyInputObjectSchema, z.array(ViewCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ViewCreateManyAndReturnArgs>;

export const ViewCreateManyAndReturnZodSchema = z.object({ select: ViewSelectObjectSchema.optional(), data: z.union([ ViewCreateManyInputObjectSchema, z.array(ViewCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();