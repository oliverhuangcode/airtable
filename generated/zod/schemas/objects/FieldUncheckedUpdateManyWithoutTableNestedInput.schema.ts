import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { FieldCreateWithoutTableInputObjectSchema as FieldCreateWithoutTableInputObjectSchema } from './FieldCreateWithoutTableInput.schema';
import { FieldUncheckedCreateWithoutTableInputObjectSchema as FieldUncheckedCreateWithoutTableInputObjectSchema } from './FieldUncheckedCreateWithoutTableInput.schema';
import { FieldCreateOrConnectWithoutTableInputObjectSchema as FieldCreateOrConnectWithoutTableInputObjectSchema } from './FieldCreateOrConnectWithoutTableInput.schema';
import { FieldUpsertWithWhereUniqueWithoutTableInputObjectSchema as FieldUpsertWithWhereUniqueWithoutTableInputObjectSchema } from './FieldUpsertWithWhereUniqueWithoutTableInput.schema';
import { FieldCreateManyTableInputEnvelopeObjectSchema as FieldCreateManyTableInputEnvelopeObjectSchema } from './FieldCreateManyTableInputEnvelope.schema';
import { FieldWhereUniqueInputObjectSchema as FieldWhereUniqueInputObjectSchema } from './FieldWhereUniqueInput.schema';
import { FieldUpdateWithWhereUniqueWithoutTableInputObjectSchema as FieldUpdateWithWhereUniqueWithoutTableInputObjectSchema } from './FieldUpdateWithWhereUniqueWithoutTableInput.schema';
import { FieldUpdateManyWithWhereWithoutTableInputObjectSchema as FieldUpdateManyWithWhereWithoutTableInputObjectSchema } from './FieldUpdateManyWithWhereWithoutTableInput.schema';
import { FieldScalarWhereInputObjectSchema as FieldScalarWhereInputObjectSchema } from './FieldScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => FieldCreateWithoutTableInputObjectSchema), z.lazy(() => FieldCreateWithoutTableInputObjectSchema).array(), z.lazy(() => FieldUncheckedCreateWithoutTableInputObjectSchema), z.lazy(() => FieldUncheckedCreateWithoutTableInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => FieldCreateOrConnectWithoutTableInputObjectSchema), z.lazy(() => FieldCreateOrConnectWithoutTableInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => FieldUpsertWithWhereUniqueWithoutTableInputObjectSchema), z.lazy(() => FieldUpsertWithWhereUniqueWithoutTableInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => FieldCreateManyTableInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => FieldWhereUniqueInputObjectSchema), z.lazy(() => FieldWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => FieldWhereUniqueInputObjectSchema), z.lazy(() => FieldWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => FieldWhereUniqueInputObjectSchema), z.lazy(() => FieldWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => FieldWhereUniqueInputObjectSchema), z.lazy(() => FieldWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => FieldUpdateWithWhereUniqueWithoutTableInputObjectSchema), z.lazy(() => FieldUpdateWithWhereUniqueWithoutTableInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => FieldUpdateManyWithWhereWithoutTableInputObjectSchema), z.lazy(() => FieldUpdateManyWithWhereWithoutTableInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => FieldScalarWhereInputObjectSchema), z.lazy(() => FieldScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const FieldUncheckedUpdateManyWithoutTableNestedInputObjectSchema: z.ZodType<Prisma.FieldUncheckedUpdateManyWithoutTableNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.FieldUncheckedUpdateManyWithoutTableNestedInput>;
export const FieldUncheckedUpdateManyWithoutTableNestedInputObjectZodSchema = makeSchema();
