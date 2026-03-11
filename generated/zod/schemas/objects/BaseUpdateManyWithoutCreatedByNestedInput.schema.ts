import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BaseCreateWithoutCreatedByInputObjectSchema as BaseCreateWithoutCreatedByInputObjectSchema } from './BaseCreateWithoutCreatedByInput.schema';
import { BaseUncheckedCreateWithoutCreatedByInputObjectSchema as BaseUncheckedCreateWithoutCreatedByInputObjectSchema } from './BaseUncheckedCreateWithoutCreatedByInput.schema';
import { BaseCreateOrConnectWithoutCreatedByInputObjectSchema as BaseCreateOrConnectWithoutCreatedByInputObjectSchema } from './BaseCreateOrConnectWithoutCreatedByInput.schema';
import { BaseUpsertWithWhereUniqueWithoutCreatedByInputObjectSchema as BaseUpsertWithWhereUniqueWithoutCreatedByInputObjectSchema } from './BaseUpsertWithWhereUniqueWithoutCreatedByInput.schema';
import { BaseCreateManyCreatedByInputEnvelopeObjectSchema as BaseCreateManyCreatedByInputEnvelopeObjectSchema } from './BaseCreateManyCreatedByInputEnvelope.schema';
import { BaseWhereUniqueInputObjectSchema as BaseWhereUniqueInputObjectSchema } from './BaseWhereUniqueInput.schema';
import { BaseUpdateWithWhereUniqueWithoutCreatedByInputObjectSchema as BaseUpdateWithWhereUniqueWithoutCreatedByInputObjectSchema } from './BaseUpdateWithWhereUniqueWithoutCreatedByInput.schema';
import { BaseUpdateManyWithWhereWithoutCreatedByInputObjectSchema as BaseUpdateManyWithWhereWithoutCreatedByInputObjectSchema } from './BaseUpdateManyWithWhereWithoutCreatedByInput.schema';
import { BaseScalarWhereInputObjectSchema as BaseScalarWhereInputObjectSchema } from './BaseScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BaseCreateWithoutCreatedByInputObjectSchema), z.lazy(() => BaseCreateWithoutCreatedByInputObjectSchema).array(), z.lazy(() => BaseUncheckedCreateWithoutCreatedByInputObjectSchema), z.lazy(() => BaseUncheckedCreateWithoutCreatedByInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BaseCreateOrConnectWithoutCreatedByInputObjectSchema), z.lazy(() => BaseCreateOrConnectWithoutCreatedByInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => BaseUpsertWithWhereUniqueWithoutCreatedByInputObjectSchema), z.lazy(() => BaseUpsertWithWhereUniqueWithoutCreatedByInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BaseCreateManyCreatedByInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => BaseWhereUniqueInputObjectSchema), z.lazy(() => BaseWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => BaseWhereUniqueInputObjectSchema), z.lazy(() => BaseWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => BaseWhereUniqueInputObjectSchema), z.lazy(() => BaseWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => BaseWhereUniqueInputObjectSchema), z.lazy(() => BaseWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => BaseUpdateWithWhereUniqueWithoutCreatedByInputObjectSchema), z.lazy(() => BaseUpdateWithWhereUniqueWithoutCreatedByInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => BaseUpdateManyWithWhereWithoutCreatedByInputObjectSchema), z.lazy(() => BaseUpdateManyWithWhereWithoutCreatedByInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => BaseScalarWhereInputObjectSchema), z.lazy(() => BaseScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const BaseUpdateManyWithoutCreatedByNestedInputObjectSchema: z.ZodType<Prisma.BaseUpdateManyWithoutCreatedByNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.BaseUpdateManyWithoutCreatedByNestedInput>;
export const BaseUpdateManyWithoutCreatedByNestedInputObjectZodSchema = makeSchema();
