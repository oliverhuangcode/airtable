import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { FieldWhereUniqueInputObjectSchema as FieldWhereUniqueInputObjectSchema } from './FieldWhereUniqueInput.schema';
import { FieldUpdateWithoutTableInputObjectSchema as FieldUpdateWithoutTableInputObjectSchema } from './FieldUpdateWithoutTableInput.schema';
import { FieldUncheckedUpdateWithoutTableInputObjectSchema as FieldUncheckedUpdateWithoutTableInputObjectSchema } from './FieldUncheckedUpdateWithoutTableInput.schema';
import { FieldCreateWithoutTableInputObjectSchema as FieldCreateWithoutTableInputObjectSchema } from './FieldCreateWithoutTableInput.schema';
import { FieldUncheckedCreateWithoutTableInputObjectSchema as FieldUncheckedCreateWithoutTableInputObjectSchema } from './FieldUncheckedCreateWithoutTableInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => FieldWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => FieldUpdateWithoutTableInputObjectSchema), z.lazy(() => FieldUncheckedUpdateWithoutTableInputObjectSchema)]),
  create: z.union([z.lazy(() => FieldCreateWithoutTableInputObjectSchema), z.lazy(() => FieldUncheckedCreateWithoutTableInputObjectSchema)])
}).strict();
export const FieldUpsertWithWhereUniqueWithoutTableInputObjectSchema: z.ZodType<Prisma.FieldUpsertWithWhereUniqueWithoutTableInput> = makeSchema() as unknown as z.ZodType<Prisma.FieldUpsertWithWhereUniqueWithoutTableInput>;
export const FieldUpsertWithWhereUniqueWithoutTableInputObjectZodSchema = makeSchema();
