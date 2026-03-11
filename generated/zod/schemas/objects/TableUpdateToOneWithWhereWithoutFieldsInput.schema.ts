import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { TableWhereInputObjectSchema as TableWhereInputObjectSchema } from './TableWhereInput.schema';
import { TableUpdateWithoutFieldsInputObjectSchema as TableUpdateWithoutFieldsInputObjectSchema } from './TableUpdateWithoutFieldsInput.schema';
import { TableUncheckedUpdateWithoutFieldsInputObjectSchema as TableUncheckedUpdateWithoutFieldsInputObjectSchema } from './TableUncheckedUpdateWithoutFieldsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TableWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TableUpdateWithoutFieldsInputObjectSchema), z.lazy(() => TableUncheckedUpdateWithoutFieldsInputObjectSchema)])
}).strict();
export const TableUpdateToOneWithWhereWithoutFieldsInputObjectSchema: z.ZodType<Prisma.TableUpdateToOneWithWhereWithoutFieldsInput> = makeSchema() as unknown as z.ZodType<Prisma.TableUpdateToOneWithWhereWithoutFieldsInput>;
export const TableUpdateToOneWithWhereWithoutFieldsInputObjectZodSchema = makeSchema();
