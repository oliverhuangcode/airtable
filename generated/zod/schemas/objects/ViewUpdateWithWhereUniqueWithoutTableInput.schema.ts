import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ViewWhereUniqueInputObjectSchema as ViewWhereUniqueInputObjectSchema } from './ViewWhereUniqueInput.schema';
import { ViewUpdateWithoutTableInputObjectSchema as ViewUpdateWithoutTableInputObjectSchema } from './ViewUpdateWithoutTableInput.schema';
import { ViewUncheckedUpdateWithoutTableInputObjectSchema as ViewUncheckedUpdateWithoutTableInputObjectSchema } from './ViewUncheckedUpdateWithoutTableInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ViewWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ViewUpdateWithoutTableInputObjectSchema), z.lazy(() => ViewUncheckedUpdateWithoutTableInputObjectSchema)])
}).strict();
export const ViewUpdateWithWhereUniqueWithoutTableInputObjectSchema: z.ZodType<Prisma.ViewUpdateWithWhereUniqueWithoutTableInput> = makeSchema() as unknown as z.ZodType<Prisma.ViewUpdateWithWhereUniqueWithoutTableInput>;
export const ViewUpdateWithWhereUniqueWithoutTableInputObjectZodSchema = makeSchema();
