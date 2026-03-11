import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { FieldScalarWhereInputObjectSchema as FieldScalarWhereInputObjectSchema } from './FieldScalarWhereInput.schema';
import { FieldUpdateManyMutationInputObjectSchema as FieldUpdateManyMutationInputObjectSchema } from './FieldUpdateManyMutationInput.schema';
import { FieldUncheckedUpdateManyWithoutTableInputObjectSchema as FieldUncheckedUpdateManyWithoutTableInputObjectSchema } from './FieldUncheckedUpdateManyWithoutTableInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => FieldScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => FieldUpdateManyMutationInputObjectSchema), z.lazy(() => FieldUncheckedUpdateManyWithoutTableInputObjectSchema)])
}).strict();
export const FieldUpdateManyWithWhereWithoutTableInputObjectSchema: z.ZodType<Prisma.FieldUpdateManyWithWhereWithoutTableInput> = makeSchema() as unknown as z.ZodType<Prisma.FieldUpdateManyWithWhereWithoutTableInput>;
export const FieldUpdateManyWithWhereWithoutTableInputObjectZodSchema = makeSchema();
