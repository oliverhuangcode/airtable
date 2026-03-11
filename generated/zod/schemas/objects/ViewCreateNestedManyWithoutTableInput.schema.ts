import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ViewCreateWithoutTableInputObjectSchema as ViewCreateWithoutTableInputObjectSchema } from './ViewCreateWithoutTableInput.schema';
import { ViewUncheckedCreateWithoutTableInputObjectSchema as ViewUncheckedCreateWithoutTableInputObjectSchema } from './ViewUncheckedCreateWithoutTableInput.schema';
import { ViewCreateOrConnectWithoutTableInputObjectSchema as ViewCreateOrConnectWithoutTableInputObjectSchema } from './ViewCreateOrConnectWithoutTableInput.schema';
import { ViewCreateManyTableInputEnvelopeObjectSchema as ViewCreateManyTableInputEnvelopeObjectSchema } from './ViewCreateManyTableInputEnvelope.schema';
import { ViewWhereUniqueInputObjectSchema as ViewWhereUniqueInputObjectSchema } from './ViewWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ViewCreateWithoutTableInputObjectSchema), z.lazy(() => ViewCreateWithoutTableInputObjectSchema).array(), z.lazy(() => ViewUncheckedCreateWithoutTableInputObjectSchema), z.lazy(() => ViewUncheckedCreateWithoutTableInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ViewCreateOrConnectWithoutTableInputObjectSchema), z.lazy(() => ViewCreateOrConnectWithoutTableInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ViewCreateManyTableInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ViewWhereUniqueInputObjectSchema), z.lazy(() => ViewWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ViewCreateNestedManyWithoutTableInputObjectSchema: z.ZodType<Prisma.ViewCreateNestedManyWithoutTableInput> = makeSchema() as unknown as z.ZodType<Prisma.ViewCreateNestedManyWithoutTableInput>;
export const ViewCreateNestedManyWithoutTableInputObjectZodSchema = makeSchema();
