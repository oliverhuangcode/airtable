import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RecordWhereUniqueInputObjectSchema as RecordWhereUniqueInputObjectSchema } from './RecordWhereUniqueInput.schema';
import { RecordUpdateWithoutTableInputObjectSchema as RecordUpdateWithoutTableInputObjectSchema } from './RecordUpdateWithoutTableInput.schema';
import { RecordUncheckedUpdateWithoutTableInputObjectSchema as RecordUncheckedUpdateWithoutTableInputObjectSchema } from './RecordUncheckedUpdateWithoutTableInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RecordWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => RecordUpdateWithoutTableInputObjectSchema), z.lazy(() => RecordUncheckedUpdateWithoutTableInputObjectSchema)])
}).strict();
export const RecordUpdateWithWhereUniqueWithoutTableInputObjectSchema: z.ZodType<Prisma.RecordUpdateWithWhereUniqueWithoutTableInput> = makeSchema() as unknown as z.ZodType<Prisma.RecordUpdateWithWhereUniqueWithoutTableInput>;
export const RecordUpdateWithWhereUniqueWithoutTableInputObjectZodSchema = makeSchema();
