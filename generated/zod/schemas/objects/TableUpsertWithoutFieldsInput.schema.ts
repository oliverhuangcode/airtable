import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableUpdateWithoutFieldsInputObjectSchema as TableUpdateWithoutFieldsInputObjectSchema } from './TableUpdateWithoutFieldsInput.schema';
import { TableUncheckedUpdateWithoutFieldsInputObjectSchema as TableUncheckedUpdateWithoutFieldsInputObjectSchema } from './TableUncheckedUpdateWithoutFieldsInput.schema';
import { TableCreateWithoutFieldsInputObjectSchema as TableCreateWithoutFieldsInputObjectSchema } from './TableCreateWithoutFieldsInput.schema';
import { TableUncheckedCreateWithoutFieldsInputObjectSchema as TableUncheckedCreateWithoutFieldsInputObjectSchema } from './TableUncheckedCreateWithoutFieldsInput.schema';
import { TableWhereInputObjectSchema as TableWhereInputObjectSchema } from './TableWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TableUpdateWithoutFieldsInputObjectSchema), z.lazy(() => TableUncheckedUpdateWithoutFieldsInputObjectSchema)]),
  create: z.union([z.lazy(() => TableCreateWithoutFieldsInputObjectSchema), z.lazy(() => TableUncheckedCreateWithoutFieldsInputObjectSchema)]),
  where: z.lazy(() => TableWhereInputObjectSchema).optional()
}).strict();
export const TableUpsertWithoutFieldsInputObjectSchema: z.ZodType<Prisma.TableUpsertWithoutFieldsInput> = makeSchema() as unknown as z.ZodType<Prisma.TableUpsertWithoutFieldsInput>;
export const TableUpsertWithoutFieldsInputObjectZodSchema = makeSchema();
