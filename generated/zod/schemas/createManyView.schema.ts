import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ViewCreateManyInputObjectSchema as ViewCreateManyInputObjectSchema } from './objects/ViewCreateManyInput.schema';

export const ViewCreateManySchema: z.ZodType<Prisma.ViewCreateManyArgs> = z.object({ data: z.union([ ViewCreateManyInputObjectSchema, z.array(ViewCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ViewCreateManyArgs>;

export const ViewCreateManyZodSchema = z.object({ data: z.union([ ViewCreateManyInputObjectSchema, z.array(ViewCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();