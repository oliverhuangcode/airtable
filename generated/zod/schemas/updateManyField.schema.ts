import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { FieldUpdateManyMutationInputObjectSchema as FieldUpdateManyMutationInputObjectSchema } from './objects/FieldUpdateManyMutationInput.schema';
import { FieldWhereInputObjectSchema as FieldWhereInputObjectSchema } from './objects/FieldWhereInput.schema';

export const FieldUpdateManySchema: z.ZodType<Prisma.FieldUpdateManyArgs> = z.object({ data: FieldUpdateManyMutationInputObjectSchema, where: FieldWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.FieldUpdateManyArgs>;

export const FieldUpdateManyZodSchema = z.object({ data: FieldUpdateManyMutationInputObjectSchema, where: FieldWhereInputObjectSchema.optional() }).strict();