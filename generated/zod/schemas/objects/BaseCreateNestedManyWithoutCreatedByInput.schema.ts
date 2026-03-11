import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BaseCreateWithoutCreatedByInputObjectSchema as BaseCreateWithoutCreatedByInputObjectSchema } from './BaseCreateWithoutCreatedByInput.schema';
import { BaseUncheckedCreateWithoutCreatedByInputObjectSchema as BaseUncheckedCreateWithoutCreatedByInputObjectSchema } from './BaseUncheckedCreateWithoutCreatedByInput.schema';
import { BaseCreateOrConnectWithoutCreatedByInputObjectSchema as BaseCreateOrConnectWithoutCreatedByInputObjectSchema } from './BaseCreateOrConnectWithoutCreatedByInput.schema';
import { BaseCreateManyCreatedByInputEnvelopeObjectSchema as BaseCreateManyCreatedByInputEnvelopeObjectSchema } from './BaseCreateManyCreatedByInputEnvelope.schema';
import { BaseWhereUniqueInputObjectSchema as BaseWhereUniqueInputObjectSchema } from './BaseWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BaseCreateWithoutCreatedByInputObjectSchema), z.lazy(() => BaseCreateWithoutCreatedByInputObjectSchema).array(), z.lazy(() => BaseUncheckedCreateWithoutCreatedByInputObjectSchema), z.lazy(() => BaseUncheckedCreateWithoutCreatedByInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BaseCreateOrConnectWithoutCreatedByInputObjectSchema), z.lazy(() => BaseCreateOrConnectWithoutCreatedByInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BaseCreateManyCreatedByInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => BaseWhereUniqueInputObjectSchema), z.lazy(() => BaseWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const BaseCreateNestedManyWithoutCreatedByInputObjectSchema: z.ZodType<Prisma.BaseCreateNestedManyWithoutCreatedByInput> = makeSchema() as unknown as z.ZodType<Prisma.BaseCreateNestedManyWithoutCreatedByInput>;
export const BaseCreateNestedManyWithoutCreatedByInputObjectZodSchema = makeSchema();
