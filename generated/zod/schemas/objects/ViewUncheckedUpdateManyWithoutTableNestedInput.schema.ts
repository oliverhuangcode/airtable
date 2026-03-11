import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ViewCreateWithoutTableInputObjectSchema as ViewCreateWithoutTableInputObjectSchema } from './ViewCreateWithoutTableInput.schema';
import { ViewUncheckedCreateWithoutTableInputObjectSchema as ViewUncheckedCreateWithoutTableInputObjectSchema } from './ViewUncheckedCreateWithoutTableInput.schema';
import { ViewCreateOrConnectWithoutTableInputObjectSchema as ViewCreateOrConnectWithoutTableInputObjectSchema } from './ViewCreateOrConnectWithoutTableInput.schema';
import { ViewUpsertWithWhereUniqueWithoutTableInputObjectSchema as ViewUpsertWithWhereUniqueWithoutTableInputObjectSchema } from './ViewUpsertWithWhereUniqueWithoutTableInput.schema';
import { ViewCreateManyTableInputEnvelopeObjectSchema as ViewCreateManyTableInputEnvelopeObjectSchema } from './ViewCreateManyTableInputEnvelope.schema';
import { ViewWhereUniqueInputObjectSchema as ViewWhereUniqueInputObjectSchema } from './ViewWhereUniqueInput.schema';
import { ViewUpdateWithWhereUniqueWithoutTableInputObjectSchema as ViewUpdateWithWhereUniqueWithoutTableInputObjectSchema } from './ViewUpdateWithWhereUniqueWithoutTableInput.schema';
import { ViewUpdateManyWithWhereWithoutTableInputObjectSchema as ViewUpdateManyWithWhereWithoutTableInputObjectSchema } from './ViewUpdateManyWithWhereWithoutTableInput.schema';
import { ViewScalarWhereInputObjectSchema as ViewScalarWhereInputObjectSchema } from './ViewScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ViewCreateWithoutTableInputObjectSchema), z.lazy(() => ViewCreateWithoutTableInputObjectSchema).array(), z.lazy(() => ViewUncheckedCreateWithoutTableInputObjectSchema), z.lazy(() => ViewUncheckedCreateWithoutTableInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ViewCreateOrConnectWithoutTableInputObjectSchema), z.lazy(() => ViewCreateOrConnectWithoutTableInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ViewUpsertWithWhereUniqueWithoutTableInputObjectSchema), z.lazy(() => ViewUpsertWithWhereUniqueWithoutTableInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ViewCreateManyTableInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ViewWhereUniqueInputObjectSchema), z.lazy(() => ViewWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ViewWhereUniqueInputObjectSchema), z.lazy(() => ViewWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ViewWhereUniqueInputObjectSchema), z.lazy(() => ViewWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ViewWhereUniqueInputObjectSchema), z.lazy(() => ViewWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ViewUpdateWithWhereUniqueWithoutTableInputObjectSchema), z.lazy(() => ViewUpdateWithWhereUniqueWithoutTableInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ViewUpdateManyWithWhereWithoutTableInputObjectSchema), z.lazy(() => ViewUpdateManyWithWhereWithoutTableInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ViewScalarWhereInputObjectSchema), z.lazy(() => ViewScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ViewUncheckedUpdateManyWithoutTableNestedInputObjectSchema: z.ZodType<Prisma.ViewUncheckedUpdateManyWithoutTableNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ViewUncheckedUpdateManyWithoutTableNestedInput>;
export const ViewUncheckedUpdateManyWithoutTableNestedInputObjectZodSchema = makeSchema();
