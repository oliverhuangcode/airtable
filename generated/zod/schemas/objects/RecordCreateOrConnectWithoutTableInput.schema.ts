import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RecordWhereUniqueInputObjectSchema as RecordWhereUniqueInputObjectSchema } from './RecordWhereUniqueInput.schema';
import { RecordCreateWithoutTableInputObjectSchema as RecordCreateWithoutTableInputObjectSchema } from './RecordCreateWithoutTableInput.schema';
import { RecordUncheckedCreateWithoutTableInputObjectSchema as RecordUncheckedCreateWithoutTableInputObjectSchema } from './RecordUncheckedCreateWithoutTableInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RecordWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => RecordCreateWithoutTableInputObjectSchema), z.lazy(() => RecordUncheckedCreateWithoutTableInputObjectSchema)])
}).strict();
export const RecordCreateOrConnectWithoutTableInputObjectSchema: z.ZodType<Prisma.RecordCreateOrConnectWithoutTableInput> = makeSchema() as unknown as z.ZodType<Prisma.RecordCreateOrConnectWithoutTableInput>;
export const RecordCreateOrConnectWithoutTableInputObjectZodSchema = makeSchema();
