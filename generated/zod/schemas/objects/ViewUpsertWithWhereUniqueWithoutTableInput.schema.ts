import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ViewWhereUniqueInputObjectSchema as ViewWhereUniqueInputObjectSchema } from './ViewWhereUniqueInput.schema';
import { ViewUpdateWithoutTableInputObjectSchema as ViewUpdateWithoutTableInputObjectSchema } from './ViewUpdateWithoutTableInput.schema';
import { ViewUncheckedUpdateWithoutTableInputObjectSchema as ViewUncheckedUpdateWithoutTableInputObjectSchema } from './ViewUncheckedUpdateWithoutTableInput.schema';
import { ViewCreateWithoutTableInputObjectSchema as ViewCreateWithoutTableInputObjectSchema } from './ViewCreateWithoutTableInput.schema';
import { ViewUncheckedCreateWithoutTableInputObjectSchema as ViewUncheckedCreateWithoutTableInputObjectSchema } from './ViewUncheckedCreateWithoutTableInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ViewWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ViewUpdateWithoutTableInputObjectSchema), z.lazy(() => ViewUncheckedUpdateWithoutTableInputObjectSchema)]),
  create: z.union([z.lazy(() => ViewCreateWithoutTableInputObjectSchema), z.lazy(() => ViewUncheckedCreateWithoutTableInputObjectSchema)])
}).strict();
export const ViewUpsertWithWhereUniqueWithoutTableInputObjectSchema: z.ZodType<Prisma.ViewUpsertWithWhereUniqueWithoutTableInput> = makeSchema() as unknown as z.ZodType<Prisma.ViewUpsertWithWhereUniqueWithoutTableInput>;
export const ViewUpsertWithWhereUniqueWithoutTableInputObjectZodSchema = makeSchema();
