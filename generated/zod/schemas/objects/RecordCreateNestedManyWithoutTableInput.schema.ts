import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RecordCreateWithoutTableInputObjectSchema as RecordCreateWithoutTableInputObjectSchema } from './RecordCreateWithoutTableInput.schema';
import { RecordUncheckedCreateWithoutTableInputObjectSchema as RecordUncheckedCreateWithoutTableInputObjectSchema } from './RecordUncheckedCreateWithoutTableInput.schema';
import { RecordCreateOrConnectWithoutTableInputObjectSchema as RecordCreateOrConnectWithoutTableInputObjectSchema } from './RecordCreateOrConnectWithoutTableInput.schema';
import { RecordCreateManyTableInputEnvelopeObjectSchema as RecordCreateManyTableInputEnvelopeObjectSchema } from './RecordCreateManyTableInputEnvelope.schema';
import { RecordWhereUniqueInputObjectSchema as RecordWhereUniqueInputObjectSchema } from './RecordWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => RecordCreateWithoutTableInputObjectSchema), z.lazy(() => RecordCreateWithoutTableInputObjectSchema).array(), z.lazy(() => RecordUncheckedCreateWithoutTableInputObjectSchema), z.lazy(() => RecordUncheckedCreateWithoutTableInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RecordCreateOrConnectWithoutTableInputObjectSchema), z.lazy(() => RecordCreateOrConnectWithoutTableInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => RecordCreateManyTableInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => RecordWhereUniqueInputObjectSchema), z.lazy(() => RecordWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const RecordCreateNestedManyWithoutTableInputObjectSchema: z.ZodType<Prisma.RecordCreateNestedManyWithoutTableInput> = makeSchema() as unknown as z.ZodType<Prisma.RecordCreateNestedManyWithoutTableInput>;
export const RecordCreateNestedManyWithoutTableInputObjectZodSchema = makeSchema();
