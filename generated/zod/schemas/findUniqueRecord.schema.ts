import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { RecordSelectObjectSchema as RecordSelectObjectSchema } from './objects/RecordSelect.schema';
import { RecordIncludeObjectSchema as RecordIncludeObjectSchema } from './objects/RecordInclude.schema';
import { RecordWhereUniqueInputObjectSchema as RecordWhereUniqueInputObjectSchema } from './objects/RecordWhereUniqueInput.schema';

export const RecordFindUniqueSchema: z.ZodType<Prisma.RecordFindUniqueArgs> = z.object({ select: RecordSelectObjectSchema.optional(), include: RecordIncludeObjectSchema.optional(), where: RecordWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.RecordFindUniqueArgs>;

export const RecordFindUniqueZodSchema = z.object({ select: RecordSelectObjectSchema.optional(), include: RecordIncludeObjectSchema.optional(), where: RecordWhereUniqueInputObjectSchema }).strict();