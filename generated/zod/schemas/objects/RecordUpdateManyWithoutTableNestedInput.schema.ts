import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RecordCreateWithoutTableInputObjectSchema as RecordCreateWithoutTableInputObjectSchema } from './RecordCreateWithoutTableInput.schema';
import { RecordUncheckedCreateWithoutTableInputObjectSchema as RecordUncheckedCreateWithoutTableInputObjectSchema } from './RecordUncheckedCreateWithoutTableInput.schema';
import { RecordCreateOrConnectWithoutTableInputObjectSchema as RecordCreateOrConnectWithoutTableInputObjectSchema } from './RecordCreateOrConnectWithoutTableInput.schema';
import { RecordUpsertWithWhereUniqueWithoutTableInputObjectSchema as RecordUpsertWithWhereUniqueWithoutTableInputObjectSchema } from './RecordUpsertWithWhereUniqueWithoutTableInput.schema';
import { RecordCreateManyTableInputEnvelopeObjectSchema as RecordCreateManyTableInputEnvelopeObjectSchema } from './RecordCreateManyTableInputEnvelope.schema';
import { RecordWhereUniqueInputObjectSchema as RecordWhereUniqueInputObjectSchema } from './RecordWhereUniqueInput.schema';
import { RecordUpdateWithWhereUniqueWithoutTableInputObjectSchema as RecordUpdateWithWhereUniqueWithoutTableInputObjectSchema } from './RecordUpdateWithWhereUniqueWithoutTableInput.schema';
import { RecordUpdateManyWithWhereWithoutTableInputObjectSchema as RecordUpdateManyWithWhereWithoutTableInputObjectSchema } from './RecordUpdateManyWithWhereWithoutTableInput.schema';
import { RecordScalarWhereInputObjectSchema as RecordScalarWhereInputObjectSchema } from './RecordScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => RecordCreateWithoutTableInputObjectSchema), z.lazy(() => RecordCreateWithoutTableInputObjectSchema).array(), z.lazy(() => RecordUncheckedCreateWithoutTableInputObjectSchema), z.lazy(() => RecordUncheckedCreateWithoutTableInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RecordCreateOrConnectWithoutTableInputObjectSchema), z.lazy(() => RecordCreateOrConnectWithoutTableInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => RecordUpsertWithWhereUniqueWithoutTableInputObjectSchema), z.lazy(() => RecordUpsertWithWhereUniqueWithoutTableInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => RecordCreateManyTableInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => RecordWhereUniqueInputObjectSchema), z.lazy(() => RecordWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => RecordWhereUniqueInputObjectSchema), z.lazy(() => RecordWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => RecordWhereUniqueInputObjectSchema), z.lazy(() => RecordWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => RecordWhereUniqueInputObjectSchema), z.lazy(() => RecordWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => RecordUpdateWithWhereUniqueWithoutTableInputObjectSchema), z.lazy(() => RecordUpdateWithWhereUniqueWithoutTableInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => RecordUpdateManyWithWhereWithoutTableInputObjectSchema), z.lazy(() => RecordUpdateManyWithWhereWithoutTableInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => RecordScalarWhereInputObjectSchema), z.lazy(() => RecordScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const RecordUpdateManyWithoutTableNestedInputObjectSchema: z.ZodType<Prisma.RecordUpdateManyWithoutTableNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.RecordUpdateManyWithoutTableNestedInput>;
export const RecordUpdateManyWithoutTableNestedInputObjectZodSchema = makeSchema();
