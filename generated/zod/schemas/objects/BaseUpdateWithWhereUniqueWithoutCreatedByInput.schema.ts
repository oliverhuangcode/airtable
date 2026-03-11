import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BaseWhereUniqueInputObjectSchema as BaseWhereUniqueInputObjectSchema } from './BaseWhereUniqueInput.schema';
import { BaseUpdateWithoutCreatedByInputObjectSchema as BaseUpdateWithoutCreatedByInputObjectSchema } from './BaseUpdateWithoutCreatedByInput.schema';
import { BaseUncheckedUpdateWithoutCreatedByInputObjectSchema as BaseUncheckedUpdateWithoutCreatedByInputObjectSchema } from './BaseUncheckedUpdateWithoutCreatedByInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BaseWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => BaseUpdateWithoutCreatedByInputObjectSchema), z.lazy(() => BaseUncheckedUpdateWithoutCreatedByInputObjectSchema)])
}).strict();
export const BaseUpdateWithWhereUniqueWithoutCreatedByInputObjectSchema: z.ZodType<Prisma.BaseUpdateWithWhereUniqueWithoutCreatedByInput> = makeSchema() as unknown as z.ZodType<Prisma.BaseUpdateWithWhereUniqueWithoutCreatedByInput>;
export const BaseUpdateWithWhereUniqueWithoutCreatedByInputObjectZodSchema = makeSchema();
