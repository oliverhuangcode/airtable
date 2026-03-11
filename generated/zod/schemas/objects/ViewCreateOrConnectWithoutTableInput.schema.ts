import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ViewWhereUniqueInputObjectSchema as ViewWhereUniqueInputObjectSchema } from './ViewWhereUniqueInput.schema';
import { ViewCreateWithoutTableInputObjectSchema as ViewCreateWithoutTableInputObjectSchema } from './ViewCreateWithoutTableInput.schema';
import { ViewUncheckedCreateWithoutTableInputObjectSchema as ViewUncheckedCreateWithoutTableInputObjectSchema } from './ViewUncheckedCreateWithoutTableInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ViewWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ViewCreateWithoutTableInputObjectSchema), z.lazy(() => ViewUncheckedCreateWithoutTableInputObjectSchema)])
}).strict();
export const ViewCreateOrConnectWithoutTableInputObjectSchema: z.ZodType<Prisma.ViewCreateOrConnectWithoutTableInput> = makeSchema() as unknown as z.ZodType<Prisma.ViewCreateOrConnectWithoutTableInput>;
export const ViewCreateOrConnectWithoutTableInputObjectZodSchema = makeSchema();
