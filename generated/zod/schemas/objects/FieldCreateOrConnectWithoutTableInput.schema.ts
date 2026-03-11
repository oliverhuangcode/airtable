import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { FieldWhereUniqueInputObjectSchema as FieldWhereUniqueInputObjectSchema } from './FieldWhereUniqueInput.schema';
import { FieldCreateWithoutTableInputObjectSchema as FieldCreateWithoutTableInputObjectSchema } from './FieldCreateWithoutTableInput.schema';
import { FieldUncheckedCreateWithoutTableInputObjectSchema as FieldUncheckedCreateWithoutTableInputObjectSchema } from './FieldUncheckedCreateWithoutTableInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => FieldWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => FieldCreateWithoutTableInputObjectSchema), z.lazy(() => FieldUncheckedCreateWithoutTableInputObjectSchema)])
}).strict();
export const FieldCreateOrConnectWithoutTableInputObjectSchema: z.ZodType<Prisma.FieldCreateOrConnectWithoutTableInput> = makeSchema() as unknown as z.ZodType<Prisma.FieldCreateOrConnectWithoutTableInput>;
export const FieldCreateOrConnectWithoutTableInputObjectZodSchema = makeSchema();
