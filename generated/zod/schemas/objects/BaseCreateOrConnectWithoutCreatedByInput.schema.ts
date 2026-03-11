import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BaseWhereUniqueInputObjectSchema as BaseWhereUniqueInputObjectSchema } from './BaseWhereUniqueInput.schema';
import { BaseCreateWithoutCreatedByInputObjectSchema as BaseCreateWithoutCreatedByInputObjectSchema } from './BaseCreateWithoutCreatedByInput.schema';
import { BaseUncheckedCreateWithoutCreatedByInputObjectSchema as BaseUncheckedCreateWithoutCreatedByInputObjectSchema } from './BaseUncheckedCreateWithoutCreatedByInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BaseWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BaseCreateWithoutCreatedByInputObjectSchema), z.lazy(() => BaseUncheckedCreateWithoutCreatedByInputObjectSchema)])
}).strict();
export const BaseCreateOrConnectWithoutCreatedByInputObjectSchema: z.ZodType<Prisma.BaseCreateOrConnectWithoutCreatedByInput> = makeSchema() as unknown as z.ZodType<Prisma.BaseCreateOrConnectWithoutCreatedByInput>;
export const BaseCreateOrConnectWithoutCreatedByInputObjectZodSchema = makeSchema();
