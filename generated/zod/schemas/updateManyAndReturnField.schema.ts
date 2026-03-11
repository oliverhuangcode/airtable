import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { FieldSelectObjectSchema as FieldSelectObjectSchema } from './objects/FieldSelect.schema';
import { FieldUpdateManyMutationInputObjectSchema as FieldUpdateManyMutationInputObjectSchema } from './objects/FieldUpdateManyMutationInput.schema';
import { FieldWhereInputObjectSchema as FieldWhereInputObjectSchema } from './objects/FieldWhereInput.schema';

export const FieldUpdateManyAndReturnSchema: z.ZodType<Prisma.FieldUpdateManyAndReturnArgs> = z.object({ select: FieldSelectObjectSchema.optional(), data: FieldUpdateManyMutationInputObjectSchema, where: FieldWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.FieldUpdateManyAndReturnArgs>;

export const FieldUpdateManyAndReturnZodSchema = z.object({ select: FieldSelectObjectSchema.optional(), data: FieldUpdateManyMutationInputObjectSchema, where: FieldWhereInputObjectSchema.optional() }).strict();