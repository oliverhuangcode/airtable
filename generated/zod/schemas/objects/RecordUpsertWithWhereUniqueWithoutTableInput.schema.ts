import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RecordWhereUniqueInputObjectSchema as RecordWhereUniqueInputObjectSchema } from './RecordWhereUniqueInput.schema';
import { RecordUpdateWithoutTableInputObjectSchema as RecordUpdateWithoutTableInputObjectSchema } from './RecordUpdateWithoutTableInput.schema';
import { RecordUncheckedUpdateWithoutTableInputObjectSchema as RecordUncheckedUpdateWithoutTableInputObjectSchema } from './RecordUncheckedUpdateWithoutTableInput.schema';
import { RecordCreateWithoutTableInputObjectSchema as RecordCreateWithoutTableInputObjectSchema } from './RecordCreateWithoutTableInput.schema';
import { RecordUncheckedCreateWithoutTableInputObjectSchema as RecordUncheckedCreateWithoutTableInputObjectSchema } from './RecordUncheckedCreateWithoutTableInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RecordWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => RecordUpdateWithoutTableInputObjectSchema), z.lazy(() => RecordUncheckedUpdateWithoutTableInputObjectSchema)]),
  create: z.union([z.lazy(() => RecordCreateWithoutTableInputObjectSchema), z.lazy(() => RecordUncheckedCreateWithoutTableInputObjectSchema)])
}).strict();
export const RecordUpsertWithWhereUniqueWithoutTableInputObjectSchema: z.ZodType<Prisma.RecordUpsertWithWhereUniqueWithoutTableInput> = makeSchema() as unknown as z.ZodType<Prisma.RecordUpsertWithWhereUniqueWithoutTableInput>;
export const RecordUpsertWithWhereUniqueWithoutTableInputObjectZodSchema = makeSchema();
