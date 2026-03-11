import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RecordScalarWhereInputObjectSchema as RecordScalarWhereInputObjectSchema } from './RecordScalarWhereInput.schema';
import { RecordUpdateManyMutationInputObjectSchema as RecordUpdateManyMutationInputObjectSchema } from './RecordUpdateManyMutationInput.schema';
import { RecordUncheckedUpdateManyWithoutTableInputObjectSchema as RecordUncheckedUpdateManyWithoutTableInputObjectSchema } from './RecordUncheckedUpdateManyWithoutTableInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RecordScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => RecordUpdateManyMutationInputObjectSchema), z.lazy(() => RecordUncheckedUpdateManyWithoutTableInputObjectSchema)])
}).strict();
export const RecordUpdateManyWithWhereWithoutTableInputObjectSchema: z.ZodType<Prisma.RecordUpdateManyWithWhereWithoutTableInput> = makeSchema() as unknown as z.ZodType<Prisma.RecordUpdateManyWithWhereWithoutTableInput>;
export const RecordUpdateManyWithWhereWithoutTableInputObjectZodSchema = makeSchema();
