import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { FieldCreateWithoutTableInputObjectSchema as FieldCreateWithoutTableInputObjectSchema } from './FieldCreateWithoutTableInput.schema';
import { FieldUncheckedCreateWithoutTableInputObjectSchema as FieldUncheckedCreateWithoutTableInputObjectSchema } from './FieldUncheckedCreateWithoutTableInput.schema';
import { FieldCreateOrConnectWithoutTableInputObjectSchema as FieldCreateOrConnectWithoutTableInputObjectSchema } from './FieldCreateOrConnectWithoutTableInput.schema';
import { FieldCreateManyTableInputEnvelopeObjectSchema as FieldCreateManyTableInputEnvelopeObjectSchema } from './FieldCreateManyTableInputEnvelope.schema';
import { FieldWhereUniqueInputObjectSchema as FieldWhereUniqueInputObjectSchema } from './FieldWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => FieldCreateWithoutTableInputObjectSchema), z.lazy(() => FieldCreateWithoutTableInputObjectSchema).array(), z.lazy(() => FieldUncheckedCreateWithoutTableInputObjectSchema), z.lazy(() => FieldUncheckedCreateWithoutTableInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => FieldCreateOrConnectWithoutTableInputObjectSchema), z.lazy(() => FieldCreateOrConnectWithoutTableInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => FieldCreateManyTableInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => FieldWhereUniqueInputObjectSchema), z.lazy(() => FieldWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const FieldCreateNestedManyWithoutTableInputObjectSchema: z.ZodType<Prisma.FieldCreateNestedManyWithoutTableInput> = makeSchema() as unknown as z.ZodType<Prisma.FieldCreateNestedManyWithoutTableInput>;
export const FieldCreateNestedManyWithoutTableInputObjectZodSchema = makeSchema();
