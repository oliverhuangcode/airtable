import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { FieldWhereUniqueInputObjectSchema as FieldWhereUniqueInputObjectSchema } from './FieldWhereUniqueInput.schema';
import { FieldUpdateWithoutTableInputObjectSchema as FieldUpdateWithoutTableInputObjectSchema } from './FieldUpdateWithoutTableInput.schema';
import { FieldUncheckedUpdateWithoutTableInputObjectSchema as FieldUncheckedUpdateWithoutTableInputObjectSchema } from './FieldUncheckedUpdateWithoutTableInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => FieldWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => FieldUpdateWithoutTableInputObjectSchema), z.lazy(() => FieldUncheckedUpdateWithoutTableInputObjectSchema)])
}).strict();
export const FieldUpdateWithWhereUniqueWithoutTableInputObjectSchema: z.ZodType<Prisma.FieldUpdateWithWhereUniqueWithoutTableInput> = makeSchema() as unknown as z.ZodType<Prisma.FieldUpdateWithWhereUniqueWithoutTableInput>;
export const FieldUpdateWithWhereUniqueWithoutTableInputObjectZodSchema = makeSchema();
