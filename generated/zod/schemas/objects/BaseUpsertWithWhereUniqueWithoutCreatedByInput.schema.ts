import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BaseWhereUniqueInputObjectSchema as BaseWhereUniqueInputObjectSchema } from './BaseWhereUniqueInput.schema';
import { BaseUpdateWithoutCreatedByInputObjectSchema as BaseUpdateWithoutCreatedByInputObjectSchema } from './BaseUpdateWithoutCreatedByInput.schema';
import { BaseUncheckedUpdateWithoutCreatedByInputObjectSchema as BaseUncheckedUpdateWithoutCreatedByInputObjectSchema } from './BaseUncheckedUpdateWithoutCreatedByInput.schema';
import { BaseCreateWithoutCreatedByInputObjectSchema as BaseCreateWithoutCreatedByInputObjectSchema } from './BaseCreateWithoutCreatedByInput.schema';
import { BaseUncheckedCreateWithoutCreatedByInputObjectSchema as BaseUncheckedCreateWithoutCreatedByInputObjectSchema } from './BaseUncheckedCreateWithoutCreatedByInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BaseWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => BaseUpdateWithoutCreatedByInputObjectSchema), z.lazy(() => BaseUncheckedUpdateWithoutCreatedByInputObjectSchema)]),
  create: z.union([z.lazy(() => BaseCreateWithoutCreatedByInputObjectSchema), z.lazy(() => BaseUncheckedCreateWithoutCreatedByInputObjectSchema)])
}).strict();
export const BaseUpsertWithWhereUniqueWithoutCreatedByInputObjectSchema: z.ZodType<Prisma.BaseUpsertWithWhereUniqueWithoutCreatedByInput> = makeSchema() as unknown as z.ZodType<Prisma.BaseUpsertWithWhereUniqueWithoutCreatedByInput>;
export const BaseUpsertWithWhereUniqueWithoutCreatedByInputObjectZodSchema = makeSchema();
