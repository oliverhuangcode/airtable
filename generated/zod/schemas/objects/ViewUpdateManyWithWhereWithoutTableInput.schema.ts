import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ViewScalarWhereInputObjectSchema as ViewScalarWhereInputObjectSchema } from './ViewScalarWhereInput.schema';
import { ViewUpdateManyMutationInputObjectSchema as ViewUpdateManyMutationInputObjectSchema } from './ViewUpdateManyMutationInput.schema';
import { ViewUncheckedUpdateManyWithoutTableInputObjectSchema as ViewUncheckedUpdateManyWithoutTableInputObjectSchema } from './ViewUncheckedUpdateManyWithoutTableInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ViewScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ViewUpdateManyMutationInputObjectSchema), z.lazy(() => ViewUncheckedUpdateManyWithoutTableInputObjectSchema)])
}).strict();
export const ViewUpdateManyWithWhereWithoutTableInputObjectSchema: z.ZodType<Prisma.ViewUpdateManyWithWhereWithoutTableInput> = makeSchema() as unknown as z.ZodType<Prisma.ViewUpdateManyWithWhereWithoutTableInput>;
export const ViewUpdateManyWithWhereWithoutTableInputObjectZodSchema = makeSchema();
