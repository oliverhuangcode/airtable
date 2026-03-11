import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BaseScalarWhereInputObjectSchema as BaseScalarWhereInputObjectSchema } from './BaseScalarWhereInput.schema';
import { BaseUpdateManyMutationInputObjectSchema as BaseUpdateManyMutationInputObjectSchema } from './BaseUpdateManyMutationInput.schema';
import { BaseUncheckedUpdateManyWithoutCreatedByInputObjectSchema as BaseUncheckedUpdateManyWithoutCreatedByInputObjectSchema } from './BaseUncheckedUpdateManyWithoutCreatedByInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BaseScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => BaseUpdateManyMutationInputObjectSchema), z.lazy(() => BaseUncheckedUpdateManyWithoutCreatedByInputObjectSchema)])
}).strict();
export const BaseUpdateManyWithWhereWithoutCreatedByInputObjectSchema: z.ZodType<Prisma.BaseUpdateManyWithWhereWithoutCreatedByInput> = makeSchema() as unknown as z.ZodType<Prisma.BaseUpdateManyWithWhereWithoutCreatedByInput>;
export const BaseUpdateManyWithWhereWithoutCreatedByInputObjectZodSchema = makeSchema();
